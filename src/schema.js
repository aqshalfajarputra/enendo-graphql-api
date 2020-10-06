const { buildSchema } = require('graphql');
const schema = buildSchema(`
        scalar Upload
        type User {
            id: ID!
            name: String
            email: String!
            address: [Address!]!
            order: [Order!]!
            payment: [Payment!]!
            shipping : Shipping!
            product_fav : [ProductFav!]!
            event : [Event!]
        }

        type Address {
            id: ID!
            address: String!
            name: String!
            phone: String!
            user: User!
            shipping: [Shipping!]!
            city_id : Int!,
            city_name : String!,
            province_id : Int!,
            province : String!,
        }


        type Province {
            province_id : String!,
            province : String!
        }

        type City {
            city_id : String!,
            city_name : String!
            province_id : String!,
            province : String!
        }

        type Shipping {
            id: ID!
            ship_no: String
            ship_charge: Float!
            status: String!
            disc_amount: Float!
            total_amount: Float!
            order : Order!
            address : Address!
        }

        type Order {
            id: ID!
            order_no: String!
            status: String!
            disc_amount: Float!
            total_amount: Float!
            user: User!
            shipping : Shipping!
            payment : Payment!
            coupon : Coupon!
            order_detail : [OrderDetail!]!
        }

        type Payment {
            id: ID!
            payment_no : String
            status : String
            user : User!
            total_amount : String
            payment_type : String
            payment_vendor : String
            order_id : String
            transaction_id : String
            payment_channel : String
        }

        type Coupon {
            id: ID!
            coupon_code: String!
            status: Int!
            percentage: Int!
            type: Int!
            min_amount: Float!
            max_amount: Float!
            description: String!
            coupon_start : String!
            coupon_end : String!
            order : [Order!]! 
        }

        type OrderDetail {
            id: ID!
            qty: Int!
            order : Order!
            product : Product!
        }

        type Product {
            id : ID!
            name : String!
            description : String!
            price : Float!
            image_1 : String
            image_2 : String
            image_3 : String
            product_no : String
            qty : Int!
            product_category : [ProductCategory!]!
            product_fav : [ProductFav!]!
            discount_tag_product : [DiscountTagProduct!]!
        }

        type ProductCategory {
            id : ID!
            product : Product!
            category : Category!
        }

        type Category {
            id : ID!
            name : ID!
            product_category : [ProductCategory]!
        }

        type ProductFav {
            id : ID!
            user : User!
            product : Product!
        }

        type Event {
            id : ID!
            user : User!
            status : String!
            qty : Int!
            product : Product!
        }

        type Invoice {
            id : ID!
            order : Order!
            payment : Payment!
        }

        type Discount{
            id : ID!
            name : String!
            percentage : Float!
            description : String!
            discount_start : String!
            discount_end : String!
            discount_tag : [DiscountTag!]!
        }

        type DiscountTag{
            id : ID!
            name : String!
            discount_tag_product : [DiscountTagProduct!]!
        }

        type DiscountTagProduct {
            id : ID!
            discount_tag : DiscountTag!
            product : Product!
        }

        type ShippingService {
            service: String!,
            description: String!,
            cost: [ShippingCost]
        }

        type ShippingCost {
            value : Int!
            etd : String!
            note : String!
        }

        type Query {
            user(id: ID!): User
            all_user: [User!]!
            address(id: String!): Address
            all_address: [Address!]!
            order(id: String!): Order
            all_order: [Order!]
            shipping(id: String!) : Shipping
            all_shipping : [Shipping!]!
            payment(id: String!) : Payment
            all_payment : [Payment!]!
            coupon(id: String!) : Coupon
            all_coupon : [Coupon!]!
            product_category(id: String!) : ProductCategory
            all_product_category : [ProductCategory!]!
            product_fav(id: String!) : ProductFav
            all_product_fav : [ProductFav!]!
            category(id: String!) : Category
            all_category : [Category!]!
            product(id: String!) : Product
            all_product : [Product!]!
            event(id: String!) : Event
            all_event : [Event!]!
            invoice(id: String!) : Invoice
            all_invoice : [Invoice!]!
            discount(id: String!) : Discount
            all_discount : [Discount!]!
            discount_tag(id: String!) : DiscountTag
            all_discount_tag : [DiscountTag!]!
            discount_tag_product(id: String!) : DiscountTagProduct
            all_discount_tag_product : [DiscountTagProduct!]!
            province(province_id:String!) : Province!
            all_province : [Province!]
            city(city_id:String!) : City
            all_city : [City!]
            city_by_province(province_id : String!) : [City!]
            shipping_charge (address_id : String!, weight : Int!, courier : String!) : [ShippingService!]!
        }

        type Mutation {

            #Admin
            createProduct(data: CreateProductInput!) : Product!
            updateProduct(data: UpdateProductInput!, id : String!) : RegularResponse!
            deleteProduct(id : String!): RegularResponse!

            createCategory(data: CreateCategoryInput!) : Category!
            updateCategory(data: UpdateCategoryInput!, id : String!) : RegularResponse!
            deleteCategory(id : String!): RegularResponse!

            createProductCategory(data: [CreateProductCategoryInput!]!, category_id : String!) : RegularResponse!
            updateProductCategory(data: [UpdateProductCategoryInput!]!, category_id : String!) : RegularResponse!
            deleteProductCategory( category_id : String!): RegularResponse!

            createDiscountTag(data: CreateDiscountTagInput!) : DiscountTag!
            updateDiscountTag(data: UpdateDiscountTagInput!, id : String!) : RegularResponse!
            deleteDiscountTag(id : String!): RegularResponse!

            createDiscountTagProduct(data: [CreateDiscountTagProductInput!]!, discount_tag_id : String!) : RegularResponse!
            updateDiscountTagProduct(data: [UpdateDiscountTagProductInput!]!, discount_tag_id : String!) : RegularResponse!
            deleteDiscountTagProduct(id : String!): RegularResponse!

            createDiscount(data: CreateDiscountInput!) : Discount!
            updateDiscount(data: UpdateDiscountInput!, id : String!) : RegularResponse!
            deleteDiscount(id : String!): RegularResponse!


            #User
            signupUser(data: CreateUserInput!) : AuthPayLoad!
            loginUser(data: LoginUserInput!): AuthPayLoad!
            updateUser(data: UpdateUserInput!) : AuthPayLoad!
            updatePasswordUser(data: UpdatePasswordUserInput!): AuthPayLoad!

            createAddress(data: CreateAddressInput!): Address!
            updateAddress(data: UpdateAddressInput!, id : String!): RegularResponse!
            deleteAddress(id : String!): RegularResponse!

            createOrder(data: CreateOrderInput!): RegularResponse!
            updateOrder(data: UpdateOrderInput!, id : String!): RegularResponse!
            deleteOrder(id : String!): RegularResponse!

            createShipping(data: CreateShippingInput!): Shipping!
            updateShipping(data: UpdateShippingInput!, id : String!): RegularResponse!
            deleteShipping(id : String!): RegularResponse!

            createPayment(data: CreatePaymentInput!): Payment!
            updatePayment(data: UpdatePaymentInput!, id : String!): RegularResponse!
            deletePayment(id : String!): RegularResponse!

            createProductFav(data: CreateProductFavInput!): ProductFav!
            deleteProductFav(id : String!): RegularResponse!

            createEvent(data: CreateEventInput!): Event!
            updateEvent(data: UpdateEventInput!): RegularResponse!
            deleteEvent(id : String!): RegularResponse!

            
        }


        type RegularResponse {
            status : Boolean!
            message : String!
        }

        type AuthPayLoad {
            token: String
            status : Boolean!
            message : String!
        }

        input CreateUserInput {
            email: String!
            name: String!
            password: String!
        }

        input UpdateUserInput {
            email: String
            name: String
            password : String!
        }

        input UpdatePasswordUserInput {
            password_old: String!
            password_new : String!
            password_confirmation : String!
        }

        input LoginUserInput {
            email: String!
            password: String!
        }

        input CreateAddressInput {
            user_id: String
            name: String!
            address: String!
            phone: String!
            city_id : Int
            city_name : String
            province_id : Int
            province : String
        }

        input UpdateAddressInput {
            name: String
            address: String
            phone: String
            city_id : Int
            city_name : String
            province_id : Int
            province : String
        }

        input CreateProductInput {
            name : String!
            description : String
            price : Float!
            qty : Int!
            image_1 : [Upload!]!
            image_2 : Upload
            image_3 : Upload
            weight : Int!
        }

        input UpdateProductInput {
            name : String!
            description : String
            price : Float!
            qty : Int!
            image_1 : [Upload!]!
            image_2 : Upload
            image_3 : Upload
            weight : Int!
        }

        input CreateProductFavInput {
            user_id : String!
            product_id : String!
        }

        input CreateEventInput {
            user_id : String!
            product_id : String!
            qty : Int!
        }

        input UpdateEventInput {
            product_id : String!
            qty : Int!
        }

        input CreateShippingInput {
            ship_charge : Float!
            discount : Float
            total_amount : Float!
            address_id : String!
            total_weight : Float!
            ship_courier : String!
            ship_service : String!
        }

        input UpdateShippingInput {
            status : String!
        }

        input CheckShippingInput {
            address_id: String!
            ship_courier: String!
        }

        input CreateOrderInput {
            status: String
            amount : Float!
            disc_amount: Float!
            total_amount: Float!
            coupon_id : String
            order_detail : [CreateOrderDetailInput!]!
            shipping : CreateShippingInput!
            payment : CreatePaymentInput
        }

        input CreateOrderDetailInput {
            product_id : String!
            qty : Int!
        }

        input UpdateOrderInput {
            status: String!
            disc_amount: Float!
            total_amount: Float!
            shipping_id : String!
            payment_id : String!
            coupon_id : String!
        }

        input CreatePaymentInput {
            payment_no : String
            status : String
            user_id : String
            total_amount : Float
            payment_type : String
            payment_vendor : String
            order_id : String
            transaction_id : String
            payment_channel : Int
        }

        input UpdatePaymentInput {
            payment_proof: String!
            status: String!
            total_amount: Float!
        }

        input CreateDiscountTagInput {
            name : String!
        }

        input UpdateDiscountTagInput {
            name : String!
        }

        input CreateDiscountTagProductInput {
            product_id : String!
        }

        input UpdateDiscountTagProductInput {
            product_id : String
        }

        input CreateDiscountInput {
            name : String!
            percentage : Float!
            description : String!
            discount_start : String!
            discount_end : String!
            discount_tag_id : String!
        }

        input UpdateDiscountInput {
            name : String
            percentage : Float
            description : String
            discount_start : String
            discount_end : String
            discount_tag_id : String
        }

        input CreateCategoryInput {
            name : String!
        }

        input UpdateCategoryInput {
            name : String
        }

        input CreateProductCategoryInput {
            product_id : String!
        }

        input UpdateProductCategoryInput {
            product_id : String!
        }
`);

module.exports = { schema }