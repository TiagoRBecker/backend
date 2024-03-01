import { Request, Response, response } from "express";
class Pagarme {
  async createOrder(req: Request, res: Response) {
    const { cart, data, id } = req.body;

    const code: string = data.phone.substring(0, 2);
    const phone: string = data.phone.slice(2);
    const catClient = data.doc?.length > 11 ? "company" : "individual";
    const docType = data.doc?.length > 11 ? "cnpj" : "cpf";
    const items = cart.map((item: any) => {
      return {
        code: item.id,
        quantity: 1,
        amount: item.price,
        description: item.name,
      };
    });

    const totalAmount = items.reduce((accumulator: any, currentValue: any) => {
      return accumulator + currentValue.amount;
    }, 0);

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${process.env.SECRET_KEY}`,
      },
      body: JSON.stringify({
        customer: {
          address: {
            country: "BR",
            state: "RS",
            city: data.city,
            zip_code: "Seu CEP",
            line_1: data.adress,
            line_2: "casa",
          },

          phones: {
            home_phone: {
              country_code: "55",
              area_code: code,
              number: "995338612",
            },
            mobile_phone: {
              country_code: "55",
              area_code: code,
              number: phone,
            },
          },
          name: "Tiago",
          type: catClient,
          document_type: docType,
          document: data.doc,
          email: data.email,
        },
        items: items,

        payments: [
          {
            payment_method: "checkout",

            checkout: {
              expires_in: 108000,
              default_payment_method: "pix",
              accepted_payment_methods: ["pix", "credit_card"],
              success_url: "http://localhost:3000/sucess",
              skip_checkout_success_page: false,
              customer_editable: true,
              billing_address_editable: false,
              Pix: {
                expires_in: 108000,
              },
              credit_card: {
                installments: [
                  {
                    number: 1,
                    total: totalAmount + 10,
                  },
                  {
                    number: 2,
                    total: totalAmount,
                  },
                  {
                    number: 3,
                    total: totalAmount,
                  },
                  {
                    number: 4,
                    total: totalAmount,
                  },
                  {
                    number: 5,
                    total: totalAmount,
                  },
                ],
                statement_descriptor: "Plash",
              },
            },
          },
        ],

        closed: true,
        metadata: { id: id },
      }),
    };
    const request = await fetch("https://api.pagar.me/core/v5/orders", options);
    const response = await request.json();
    const url = response?.checkouts[0]?.payment_url;
    return res.status(200).json(url);
  }
  async webHook(req: Request, res: Response) {
    const { id } = req.body;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Basic ${process.env.SECRET_KEY}`,
      },
    };
    const request = await fetch(
      `https://api.pagar.me/core/v5/orders/${id}`,
      options
    );
    const response = await request.json();
    if (response.status === "paid") {
      const ids = response.items.map((items: any) => parseInt(items.code));
      const getMagazines = await prisma?.magazine.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
 
      const items:any = getMagazines?.map((items: any) => {
        return {
          name: items.name,
          price:items.price,
          picture: items.cover[0],
          paidOut:Number(items.price * 2),
          toReceive:0,
          userId:Number(response.metadata.id)
        };
      });
      /*
        const items = getMagazines?.map((items: any) => {
        return {
          id: items.id,
          title: items.name,
          picture_url: items.cover,
          unit_price: items.price,
          quantity: 1,
        };
      });
      const library: any = getMagazines?.map((item: any) => {
        return {
          name: item.name,
          author:item.author,
          magazine_pdf: item.magazine_pdf,
          cover: item.cover,
          
        };
      });
      const createOrder = await prisma?.order.create({
        data: {
          items: items,
          userId: Number(response.metadata.id),
        },
      });
      
      

      const createLibrary = await prisma?.user.update({
       where:{
        id:Number(response?.metadata.id)
       },
       data:{
        library:{
         create:library

         
        }
       }
      });
      */
     
      for (const item of items) {
        const dvl = await prisma?.dvl.create({
          data: item
        });
        console.log(dvl);
      }

      return res.status(200).json(response.items);
    }
  }
  async paymentStatus(req: Request, res: Response) {
    const { order_id } = req.query;
    console.log(order_id);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Basic ${process.env.SECRET_KEY}`,
      },
    };
    const request = await fetch(
      `https://api.pagar.me/core/v5/orders/${order_id}`,
      options
    );
    const response = await request.json();
    if (response.status === "paid") {
      return res.status(200).json(response.status);
    }
  }
}

const PagarmeController = new Pagarme();
export default PagarmeController;
