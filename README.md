# Inventory Management

Inventory management is a web application which can be used to search for specific objects and their states. User first has to enter a list of inventory logs which depict the states of the various object e.g. Product, Order, Invoice, etc. and details associated with the objects like object_id, object_type, timestamp.

## Functionalities:
1. **Upload CSV File** - This is a bulk upload operation where user can upload multiple objects and their associated details at a particular timestamp. User needs to supply a CSV which should contain header for the column in the CSV file.

2. **Upload CSV Data** - This is a bulk upload operation where user can upload multiple objects and their associated details at a particular timestamp. User needs to supply a CSV string which will be directly inserted into the database which should contain header for the column in the CSV file.

3. **Search** - This operation allows you to query the system for the state of a object at any given instance. For this you need to provide object_type, object_id and the timestamp at which the state is required. 

## Components:
1. **WEB application** - This is the frontend application which is hosted @ http://ec2-54-202-82-15.us-west-2.compute.amazonaws.com:8080/inventory/. This WEB application is hosted on the AWS.

2. **NodeJS server** - This is server side component of the application which actually connects to the database to perform upload and search operations. This server exposes endpoints which are utilized by the WEB application. This server is also hosted on AWS server. 

3. **MongoDB instance** - This is the database server which is also hosted on the same machine. This database instance actually stores the CSV data and is used for querying the data on search request.

## NOTE: At a given time, the database contains records from only one CSV file. If a new CSV File/Data is uploaded, we delete the earlier data.

## DEMO link:
http://ec2-54-202-82-15.us-west-2.compute.amazonaws.com:8080/inventory/

## Support:
Mail us @ kankaria.ashish8790@gmail.com
