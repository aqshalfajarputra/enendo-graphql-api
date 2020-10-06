const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { decodedToken } = require('./authentication')
const {createWriteStream, mkdir} = require('fs')
const path = require('path')
const axios = require('axios')
const { generateID } = require('./helpers')
const { GraphQLUpload } = require('graphql-upload')

let status = true
let message = "Request Succeed!"

//Upload Image 
const storeUpload = async ({ stream, filename, mimetype, product_no }) => {
    const path = `assets/img/product/${product_no}/${filename}`;
    // (createWriteStream) writes our file to the images director
    return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))    
      .on("finish", () => resolve({ path, filename, mimetype }))
      .on("error", reject)
    );
};

const processUpload = async (upload, product_no) => {
    // console.log('ini upload',upload);
    const { createReadStream, filename, mimetype } = await upload;
    const stream = await createReadStream();
    // console.log('ini stream', stream)
    const file = await storeUpload({ stream, filename, mimetype, product_no });
    return file;
};

const uploadMultiple = async (images, product_no) => {
    let result = {}
    let counter = 1;

    for (const image of images) {
      const upload = await processUpload(image.promise, product_no)
      if (upload.length != 0){
        // console.log('ini upload', upload)
        result['image_'+counter] = upload.filename
      }
      counter++;
    }

    return result
}

//API Midtrans
const chargePayment = async (data)=>{
    let body;
    let authorization = "Basic "+"U0ItTWlkLXNlcnZlci05NktCUnpOaDI2cnFGeW9kUjd1cjhDYzI6"
    let type = data.payment_type
    let vendor = data.payment_vendor
    let order_id = data.order_id
    let total_amount = data.total_amount

    if (type == 'bank_transfer'){
        if (vendor == 'permata'){
            body = {
                payment_type: type,
                bank_transfer: {
                  bank: vendor,
                  permata: {
                    recipient_name: "   "
                  }
                },
                transaction_details: {
                  order_id: order_id,
                  gross_amount: total_amount
                }
            }
        }else if (vendor == 'bca'){
            body = {
                payment_type: type,
                bank_transfer: {
                  bank: vendor,
                  va_number : "111111",
                  free_text : {
                    "inquiry": [
                          {
                              "id": "Silahkan Bayarkan Ke Nomor Tersebut",
                              "en": "Free Text EN Free Text EN Free Text EN"
                          }
                    ],
                    "payment": [
                          {
                              "id": "Terima Kasih",
                              "en": "Free Text EN Free Text EN Free Text EN"
                          }
                    ]
                  }, 
                },
                transaction_details: {
                  order_id: order_id,
                  gross_amount: total_amount
                }
            }
        }else if (vendor == 'bni'){
            body = {
                payment_type: type,
                bank_transfer: {
                  bank: vendor,
                  va_number : "111111"
                },
                transaction_details: {
                  order_id: order_id,
                  gross_amount: total_amount
                }
            }
        }
    }

    try {
        const res = await axios.post('https://api.sandbox.midtrans.com/v2/charge',body,
        {
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
                "authorization": authorization,
            }
        });
        
        // console.log('ini sebelum status', res.data.status_code)
        if (res.data.status_code == 201){
            // console.log('ini setelah status', res.data);
            if (type == 'bank_transfer'){
                if (vendor == 'permata'){
                    res.data.va_number = res.data.permata_va_number
                }else if (vendor == 'bca'){
                    res.data.va_number = res.data.va_numbers[0].va_number
                }else if (vendor == 'bni'){
                    res.data.va_number = res.data.va_numbers[0].va_number
                }
            }
            return res.data 
        }else{
            console.log('mid trans gagal')
        }    

    } catch (error) {
        console.error(error)
    }
    
        
}

const resolvers = {
    Upload: GraphQLUpload,
    user : async ({ id }, { models }, info) => {
        return models.User.findByPk(id);
    },
    all_user : async (args, { models, req }) =>{
        // console.log(models.User.findAll());
        const decoded = decodedToken(req)
        return models.User.findAll();
    },
    all_address : async ({id}, { models }, info) => {
        return models.Address.findAll();
    },
    address : async ({ id }, { models }, info) => {
        return models.Address.findByPk(id);
    },
    order : async ({ id }, { models }, info) => {
        return models.Order.findByPk(id);
    },
    all_order : async (args, { models }, info) => {
        return models.Order.findAll();
    },
    shipping : async ({ id }, { models }, info) => {
        return models.Shipping.findByPk(id);
    },
    all_shipping : async (args, { models }, info) => {
        return models.Shipping.findAll();
    },
    payment : async ({id}, { models }, info) =>{
        return models.Payment.findByPk(id);
    },
    all_payment : async (args, { models }, info) =>{
        return models.Payment.findAll();
    }, 
    coupon : async ({id}, { models }, info) =>{
        return models.Coupon.findByPk(id);
    },
    all_coupon : async (args, { models }, info) =>{
        return models.Coupon.findAll();
    }, 
    product : async ({id}, { models }, info) =>{
        return models.Product.findByPk(id);
    },
    all_product : async (args, { models }, info) =>{
        return models.Product.findAll();
    }, 
    product_category : async ({id}, { models }, info) =>{
        return models.ProductCategory.findByPk(id);
    },
    all_product_category : async (args, { models }, info) =>{
        return models.ProductCategory.findAll();
    }, 
    category : async ({id}, { models }, info) =>{
        return models.Category.findByPk(id);
    },
    all_category : async (args, { models }, info) =>{
        return models.Category.findAll();
    }, 
    product_fav : async ({id}, { models }, info) =>{
        return models.ProductFav.findByPk(id);
    },
    all_product_fav : async (args, { models }, info) =>{
        return models.ProductFav.findAll();
    }, 
    event : async ({id}, { models }, info) =>{
        return models.Event.findByPk(id);
    },
    all_event : async (args, { models }, info) =>{
        return models.Event.findAll();
    }, 
    invoice : async ({id}, { models }, info) =>{
        return models.Invoice.findByPk(id);
    },
    all_invoice : async (args, { models }, info) =>{
        return models.Invoice.findAll();
    }, 
    discount : async ({id}, { models }, info) =>{
        return models.Discount.findByPk(id);
    },
    all_discount : async (args, { models }, info) =>{
        return models.Discount.findAll();
    }, 
    discount_tag : async ({id}, { models }, info) =>{
        return models.DiscountTag.findByPk(id);
    },
    all_discount_tag : async (args, { models }, info) =>{
        return models.DiscountTag.findAll();
    }, 
    discount_tag_product : async ({id}, { models }, info) =>{
        return models.DiscountTagProduct.findByPk(id);
    },
    all_discount_tag_product : async (args, { models }, info) =>{
        return models.DiscountTagProduct.findAll();
    },
    province: async ({province_id}, { models }, info) =>{
        let res;
        try {
            res = await axios.get('https://api.rajaongkir.com/starter/province?id='+province_id, {
                headers: {
                    'key': '1ee941f75d6b3c93c152e96758e295d4'
                }
            });
        } catch (error) {
            console.error(error)
        }
        
        if (res.data.rajaongkir.status.code == 200){
            console.log(res.data.rajaongkir);
            return res.data.rajaongkir.results
        }
    },
    all_province: async (args, { models }, info) =>{
        let res;
        try {
            res = await axios.get('https://api.rajaongkir.com/starter/province', {
                headers: {
                    'key': '1ee941f75d6b3c93c152e96758e295d4'
                }
            });
        } catch (error) {
            console.error(error)
        }
        
        if (res.data.rajaongkir.status.code == 200){
            console.log(res.data.rajaongkir);
            return res.data.rajaongkir.results
        }
    },
    city: async ({city_id}, { models }, info) =>{
        let res;
        try {
            res = await axios.get('https://api.rajaongkir.com/starter/city?id='+city_id, {
                headers: {
                    'key': '1ee941f75d6b3c93c152e96758e295d4'
                }
            });
        } catch (error) {
            console.error(error)
        }
        
        if (res.data.rajaongkir.status.code == 200){
            console.log(res.data.rajaongkir);
            return res.data.rajaongkir.results
        }
    },
    all_city: async ({id}, { models }, info) =>{
        let res;
        try {
            res = await axios.get('https://api.rajaongkir.com/starter/city', {
                headers: {
                    'key': '1ee941f75d6b3c93c152e96758e295d4'
                }
            });
        } catch (error) {
            console.error(error)
        }
        
        if (res.data.rajaongkir.status.code == 200){
            console.log(res.data.rajaongkir);
            return res.data.rajaongkir.results
        }
    },
    city_by_province: async ({province_id}, { models }, info) =>{
        let res;
        try {
            res = await axios.get('https://api.rajaongkir.com/starter/city?province='+province_id, {
                headers: {
                    'key': '1ee941f75d6b3c93c152e96758e295d4'
                }
            });
        } catch (error) {
            console.error(error)
        }
        
        if (res.data.rajaongkir.status.code == 200){
            console.log(res.data.rajaongkir);
            return res.data.rajaongkir.results
        }
    },
    shipping_charge : async ({address_id, weight, courier}, { models, req }, info) =>{
        let res;
        const address = await models.Address.findByPk(address_id);
        // console.log(address.city_id)
        try {
            res = await axios.post('https://api.rajaongkir.com/starter/cost',{
                origin: '501', destination: address.city_id, weight: weight, courier: courier
            },
            {
                headers: {
                    'key': '1ee941f75d6b3c93c152e96758e295d4'
                }
            });
        } catch (error) {
            console.error(error)
        }
        
        if (res.data.rajaongkir.status.code == 200){
            console.log(res.data.rajaongkir.results[0]);
            return res.data.rajaongkir.results[0].costs
        }
    },
    // =============== Mutation ================
    loginUser : async ({data}, { models }, info) =>{
        const email = data.email
        const password = data.password
        let token;
        const [ theUser ] = await models.User.findAll({
          where: {
            email : email
          }
        })

        if (theUser==undefined) {
            console.log('theUser', theUser);
            status = false; message = "Email not exist";
        }else{
            const isMatch = bcrypt.compareSync(password, theUser.dataValues.password);
            console.log(isMatch, 'checkifismatch');
            if (!isMatch){
                status = false; message = "Password Not Match";
            }else{
                status = true; message = "Request Succeed"
                token = jwt.sign(theUser.dataValues, "supersecret");
            } 
        }
        return {token : token, status :status, message:message};
    },
    signupUser : async ({data}, { models }, info) => {
        const email = data.email
        const name = data.name
        const password = data.password
        const newUser = await models.User.create({
          email,
          name,
          password: await bcrypt.hash(password, 10)
        });
        if(!newUser){
            status = false;
            message = "Internal Server Error"
        }

        return {token : jwt.sign(newUser.dataValues, "supersecret"), status :status, message:message};
    },
    updateUser : async ({data}, { models, req }, info) => {
        console.log(data);
        const decoded = decodedToken(req)
        const password = data.password
        const isMatch = bcrypt.compareSync(password, decoded.password)
        if(!isMatch){
            status = false
            message = "Password Not Match"
        }else{
            const updateUser = await models.User.update({data},
            { where : { id : decoded.id}});
            if (!updateUser){
                status = false
                message = "Server Request Failed"
            }
        }

        const updatedUser = models.User.findByPk(decoded.id);
        return {token : jwt.sign(updatedUser.dataValues, "supersecret"), status : status, message : message};
    },
    updatePasswordUser : async ({data}, { models, req }, info) => {

        let decoded = decodedToken(req);
        let password = data.password_new
        const password_old = data.password_old
        const password_confirmation = data.password_confirmation
        let token;
        if (password_confirmation == password){
            const isMatch = bcrypt.compareSync(password_old, decoded.password);
            console.log(isMatch);
            if (!isMatch) {
                status = false
                message = "Password Not Match"
            }else{
                password = await bcrypt.hash(password, 10)
                const updateUser = await models.User.update({
                    password: password
                },{ where : {id : decoded.id}});    
                if (!updateUser){
                    status = false
                    message = "Server Request Failed"
                }
            }
        }else{
            status = false
            message = "New Password Confirmation Not Match!"
        }
        
        const updatedUser = await models.User.findByPk(decoded.id);
        return {token : jwt.sign(updatedUser, "supersecret"), status : status, message : message};
    },
    createAddress : async ({data}, { models, req }, info) => {
        const decoded = decodedToken(req)
        const user_id = decoded.id
        data.user_id = user_id
        const create = await models.Address.create(data);
        return create;
    },
    updateAddress : async ({data, id}, { models, req }, info) => {
        const decoded = decodedToken(req)
        const update = await models.Address.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    deleteAddress : async ({id}, { models, req }, info) => {  
        const decoded = decodedToken(req)
        const deleted = models.Address.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    createEvent : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const user_id = decoded.id
        data.user_id = user_id
        const create = await models.Event.create(data);
        return create;
    },
    updateEvent : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const update = await models.Event.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    deleteEvent : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const deleted = models.Event.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    createProductFav : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const user_id = decoded.id
        data.user_id = user_id
        const create = await models.ProductFav.create(data);
        return create;
    },
    deleteProductFav : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const deleted = models.ProductFav.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    createOrder : async ({data}, { models, req }, info) => {            
        console.log(data);
        const decoded = decodedToken(req);
        let transaction;
        try {  
            
            data.shipping.ship_no = await generateID({char : "SHP"})
            data.shipping.status = '1'
            transaction = await models.sequelize.transaction();
            const createShipping = await models.Shipping.create( data.shipping, {
                transaction: transaction
            });
            
            data.user_id = decoded.id;
            data.shipping_id = createShipping.id;
            data.order_no = await generateID({char : "ORD"})
            data.status = '1'
            const createOrder = await models.Order.create( data, {
                transaction: transaction
            });

            const details = data.order_detail
            details.forEach(function(detail, index){
                data.order_detail[index].order_id = createOrder.id
            });

            const createOrderDetail = await models.OrderDetail.bulkCreate(data.order_detail, {
                transaction : transaction
            });

            // console.log('ini order detail',createOrderDetail);
            data.payment.order_id = createOrder.id
            data.payment.user_id = decoded.id
            data.payment.total_amount = data.total_amount 
            data.payment.payment_no = await generateID({char : "INV"})
            // console.log('ini payment', data.payment);

            const charge = await chargePayment(data.payment);
            // console.log('inicharge', charge);
            if (charge.status_code == '201'){
                data.payment.status = charge.transaction_status
                data.payment.transaction_id = charge.transaction_id
                data.payment.payment_channel = charge.va_number
                const createPayment = await models.Payment.create( data.payment, {
                    transaction: transaction
                });
                if (createPayment){
                    createOrder.payment_id = createPayment.id
                }
                await transaction.commit()
                await createOrder.save()
            }else{
                await transaction.rollback()
                status= false
                message = 'Error Rollback'
            }

        } catch(error) {
          if(transaction) {
            await transaction.rollback()
          }
          console.log(error)
          status= false
          message = 'Error Rollback'
        }

        return {status : status, message : message};
    },
    updateOrder : async ({data}, { models }, info) => {
        const decoded = decodedToken(req)
        const update = await models.Order.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    deleteOrder : async ({data}, { models }, info) => {  
        const decoded = decodedToken(req)
        const deleted = models.Order.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    updateShipping : async ({data}, { models }, info) => {
        const decoded = decodedToken(req)
        const update = await models.Shipping.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }else{
            const shipping = await models.Shipping.findByPk(id);
            const updateOrder = await models.Order.update({status : "4"}, {where: {id:shipping.order_id}});
        }
        return {status : status, message : message};
    },

    // =========================  ADMIN ============================ //

    //Category
    createCategory : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const create = await models.Category.create(data);
        return create;
    },
    updateCategory : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const update = await models.Category.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    deleteCategory : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const deleted = models.Category.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },

    //Product 
    createProduct : async ({data}, { models, req }, info) => {
        // console.log()
        const decoded = decodedToken(req)
        data.product_no = await generateID({char : "PRD"})
        const product_no = data.product_no.replace('/', '-')
        // console.log(product_no);
        mkdir("assets/img/product/"+product_no, { recursive: true }, (err) => {
            if (err) throw err;
        });

        const upload = await uploadMultiple(data.image_1, product_no)
        data.image_1 = upload.image_1
        data.image_2 = upload.image_2
        data.image_3 = upload.image_3

        const create = await models.Product.create(data);
        return create;
    },
    updateProduct : async ({data, id}, { models, req }, info) => {
        const decoded = decodedToken(req)

        if (data.image_1.length !== 0){

            let product = await models.Product.findByPk(id)
            product_no = product.product_no.replace('/', '-')
            const upload = await uploadMultiple(data.image_1, product_no)
            if (('image_1' in upload)){
                data.image_1 = upload.image_1
            }
            if (('image_2' in upload)){
                data.image_2 = upload.image_2
            }
            if (('image_3' in upload)){
                data.image_3 = upload.image_3
            }
        }

        const update = await models.Product.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    deleteProduct : async ({id}, { models, req }, info) => {  
        const decoded = decodedToken(req)
        const deleted = models.Product.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },

    //ProductCategory
    createProductCategory : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const create = await models.ProductCategory.create(data);
        return create;
    },
    updateProductCategory : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const update = await models.ProductCategory.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    deleteProductCategory : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const deleted = models.ProductCategory.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },

    //Discount Tag
    createDiscountTag : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const create = await models.DiscountTag.create(data);
        return create;
    },
    updateDiscountTag : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const update = await models.DiscountTag.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    deleteDiscountTag : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const deleted = models.DiscountTag.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },

    //DiscountTagProduct
    createDiscountTagProduct : async ({data, discount_tag_id}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        let transaction;
        transaction = await models.sequelize.transaction();
        data.forEach(function(value, index){
            data[index].discount_tag_id = discount_tag_id
        });

        try{
            const createDiscountTagProduct = await models.DiscountTagProduct.bulkCreate(data, {
                transaction : transaction
            });

            if(createDiscountTagProduct){
                await transaction.commit()                
            }
        }catch(error) {
            if(transaction) {
                await transaction.rollback()
            }
            status = false,
            message = "Server Request Failed"
        }

        return {status : status, message : message};
    },
    updateDiscountTagProduct : async ({data, discount_tag_id}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        let transaction;
        transaction = await models.sequelize.transaction();
        data.forEach(function(value, index){
            data[index].discount_tag_id = discount_tag_id
        });

        try{
            const deleteDiscountTagProduct = await models.DiscountTagProduct.destroy({
                where : {
                    discount_id : discount_tag_id
                },
                transaction : transaction
            })

            if(deleteDiscountTagProduct){
                const createDiscountTagProduct = await models.DiscountTagProduct.bulkCreate(data, {
                    transaction : transaction
                })
    
                if(createDiscountTagProduct){
                    await transaction.commit()                
                }
            }else{
                status = false,
                message = "Server Request Failed"
            }
        }catch(error) {
            if(transaction) {
                await transaction.rollback()
            }
            status = false,
            message = "Server Request Failed"
        }

        return {status : status, message : message};
    },
    deleteDiscountTagProduct : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const deleted = models.DiscountTagProduct.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },

    //Discount
    createDiscount : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const create = await models.Discount.create(data);
        return create;
    },
    updateDiscount : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const update = await models.Discount.update(data, {where: {id: id}});
        if (!update){
            status = false
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },
    deleteDiscount : async ({data}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const deleted = models.Discount.destroy({where : {id : id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },

    //ProductCategory
    createProductCategory : async ({data, category_id}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        let transaction;
        transaction = await models.sequelize.transaction();
        data.forEach(function(value, index){
            data[index].category_id = category_id
        });

        try{
            const createProductCategory = await models.ProductCategory.bulkCreate(data, {
                transaction : transaction
            });

            if(createProductCategory){
                await transaction.commit()                
            }
        }catch(error) {
            if(transaction) {
                await transaction.rollback()
            }
            status = false,
            message = "Server Request Failed"
        }

        // const product_category = await models.ProductCategory.findOne({
        //     where:{
        //         category_id : category_id
        //     }
        // })
        // return product_category;
        return {status : status, message : message};
    },
    updateProductCategory : async ({data, category_id}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        let transaction;
        transaction = await models.sequelize.transaction();
        data.forEach(function(value, index){
            data[index].category_id = category_id
        });

        try{
            const deleteProductCategory = await models.ProductCategory.destroy({
                where : {
                    category_id : category_id
                },
                transaction : transaction
            })

            if(deleteProductCategory){
                const createProductCategory = await models.ProductCategory.bulkCreate(data, {
                    transaction : transaction
                })
    
                if(createProductCategory){
                    await transaction.commit()                
                }
            }else{
                status = false,
                message = "Server Request Failed"
            }
        }catch(error) {
            if(transaction) {
                await transaction.rollback()
            }
            status = false,
            message = "Server Request Failed"
        }

        return {status : status, message : message};
    },
    deleteProductCategory : async ({category_id}, { models, req }, info) =>{
        const decoded = decodedToken(req)
        const deleted = models.ProductCategory.destroy({where : {category_id : category_id}})
        if(!deleted){
            status = false,
            message = "Server Request Failed"
        }
        return {status : status, message : message};
    },

    // ========================= END ADMIN ============================ //

    // ============= END MUTATION ==============
    
    User: {
         address : async (root, {data}, {models}) => {
            return models.Address.findAll({
                where:{
                    user_id : root.id
                }
            });
        },
         order : async (root, {data}, {models}) => {
            return models.Order.findAll({
                where:{
                    user_id : root.id
                }
            });
        },
         payment : async (root, {data}, {models}) => {
            return models.Payment.findAll({
                where:{
                    user_id : root.id
                }
            });
        },
         product_fav : async (root, {data}, {models}) =>{
            return models.ProductFav.findAll({
                where:{
                    user_id : root.id
                }
            });
        },
         event : async (root, {data}, {models}) =>{
            return models.Event.findOne({
                where:{
                    user_id : root.id
                }
            });
        }
    },
    Order : {
         shipping : async (root, {data}, {models}) => {
            return models.Shipping.findOne({
                where:{
                    order_id : root.id
                }
            });
        },
         payment : async (root, {data}, {models}) =>{
            return models.Payment.findOne({
                where:{
                     id : root.payment_id
                }
            });
        },
         user : async (root, {data}, {models}) =>{
            return models.User.findOne({
                where:{
                     id : root.user_id
                }
            });
        },
         coupon : async (root, {data}, {models}) =>{
            return models.Coupon.findOne({
                where:{
                     id : root.coupon_id
                }
            });
        },
         order_detail : async (root, {data}, {models}) =>{
            return models.OrderDetail.findAll({
                where:{
                     order_id : root.id
                }
            });
        },
    },
    Shipping: {
         order : async (root, {data}, {models}) =>{
            return models.Order.findOne({
                where:{
                     id : root.order_id
                }
            });
        },
         address : async (root, {data}, {models}) =>{
            return models.Address.findOne({
                where:{
                     id : root.address_id
                }
            });
        },
    },
    Payment: {
         user : async (root, {data}, {models}) =>{
            return models.User.findOne({
                where:{
                     id : root.user_id,
                }
            });
        },
    },
    Coupon: {
         order : async (root, {data}, {models}) =>{
            return models.Order.findAll({
                where:{
                     id : root.order_id
                }
            });
        },
    },
    OrderDetail: {
         order : async (root, {data}, {models}) =>{
            return models.Order.findOne({
                where:{
                     id : root.order_id
                }
            });
        },
         product : async (root, {data}, {models}) =>{
            return models.Product.findOne({
                where:{
                     id : root.product_id
                }
            });
        },
    },
    Product: {
         product_category : async (root, {data}, {models}) =>{
            return models.ProductCategory.findAll({
                where:{
                     product_id : root.id
                }
            });
        },
         discount_tag_product : async (root, {data}, {models}) =>{
            return models.DiscountTagProduct.findAll({
                where:{
                     product_id : root.id
                }
            });
        },

    },
    ProductCategory: {
         product : async (root, {data}, {models}) =>{
            return models.Product.findOne({
                where:{
                     id : root.category_id
                }
            });
        },
         category : async (root, {data}, {models}) =>{
            return models.Category.findOne({
                where:{
                     id : root.product_id
                }
            });
        },
    },
    Category : {
         product_category : async (root, {data}, {models}) =>{
            return models.ProductCategory.findAll({
                where:{
                     category_id : root.id
                }
            });
        },
    },
    ProductFav : {
         product : async (root, {data}, {models}) =>{
            return models.Product.findOne({
                where:{
                     id : root.category_id
                }
            });
        },
         user : async (root, {data}, {models}) =>{
            return models.User.findOne({
                where:{
                     id : root.user_id
                }
            });
        },
    },
    Event : {
         user : async (root, {data}, {models}) =>{
            return models.User.findOne({
                where:{
                     id : root.user_id
                }
            });
        },
         product : async (root, {data}, {models}) =>{
            return models.Product.findOne({
                where:{
                     id : root.product_id
                }
            });
        },
    },
    Invoice : {
         order : async (root, {data}, {models}) =>{
            return models.Order.findOne({
                where:{
                     id : root.order_id
                }
            });
        },
         payment : async (root, {data}, {models}) =>{
            return models.Payment.findOne({
                where:{
                     id : root.payment_id
                }
            });
        },
    },
    Discount : {
         discount_tag : async (root, {data}, {models}) =>{
            return models.DiscountTag.findAll({
                where:{
                     discount_id : root.id
                }
            });
        },
    },
    DiscountTag : {
         discount_tag_product : async (root, {data}, {models}) =>{
            return models.DiscountTagProduct.findAll({
                where:{
                     discount_tag_id : root.id
                }
            });
        },
    },
    DiscountTagProduct : {
         discount_tag : async (root, {data}, {models}) =>{
            return models.DiscountTag.findOne({
                where:{
                     id : root.discount_tag_id
                }
            });
        },
         product : async (root, {data}, {models}) =>{
            return models.Product.findone({
                where:{
                     id : root.product_id
                }
            });
        },
    },
    Address: {
         user (address) {
            // console.log(address);
            return address.getUser()
        },
         shipping : async (root, {data}, {models}) =>{
            return models.Shipping.findAll({
                where:{
                     address_id : root.id
                }
            });
        },
    }      
}

module.exports = {resolvers}