# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index : 'products/' [GET]
- Show : 'products/:id' [GET]
- Create [token required] : 'products/' [POST]
- [OPTIONAL] Top 5 most popular products: 'products/popular?top=5' [GET]
- [OPTIONAL] Products by category : 'products?category=category_name' [GET]

#### Users
- Index [token required] : 'users/' [GET]
- Show [token required] : 'users/:id' [GET]
- Create N[token required] : 'users/' [POST]

#### Orders
- Current Order by user (args: user id)[token required] : 'orders?user=user_id' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] 'orders/complete?user=user_id' [GET]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Order
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

#### Order Product
- order_id
- product_id
- quanitity

## Database Tables
#### Users Table
- id: integer
- firstName: char[35]
- lastName: char[35]
- password: char[100]

#### Products Table
- id: integer
- name: char[50]
- price: numeric[precision 12 , scale 2]
- category: char[50] (optional)

#### Orders Table
- id: integer
- status: 'ACTIVE' or 'COMPLETE'
- user_id: integer (foreign key to users table)

#### Order Products Table
- quantity: integer
- order_id: integer (foreign key to orders table)
- product_id: integer (foreign key to products table)