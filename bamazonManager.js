var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table3');

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  menu();
});

function menu(){
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
      name: "task"
    }
  ])
  .then(function(inquirerResponse) {
    switch (inquirerResponse.task) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewLowInventory();
        break;
      case "Add to Inventory":
        addToInventory();
        break;
      case "Add New Product":
        newProduct();
        break;
      case "Exit":
        endConnection();
        break;
    };
  });
};

function viewProducts(){
  connection.query("SELECT * FROM products", function(err, res){
    if(err) throw err;

    var table = new Table({
        head: ['ID', 'PRODUCT', 'DEPARTMENT', 'PRICE', 'QUANTITY']
    });
   
    for(var i = 0; i < res.length; i++){
      table.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity],
      );
    }
    console.log(table.toString());
    menu();
  });
};

function viewLowInventory(){
  connection.query("SELECT * FROM products where stock_quantity < 5", function(err, res){
    if(err) throw err;
    var table = new Table({
      head: ['ID', 'PRODUCT', 'DEPARTMENT', 'PRICE', 'QUANTITY']
    });
    for(var i = 0; i < res.length; i++){
      table.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity],
      );
    };
    console.log(table.toString());
    menu();
  });
};

function addToInventory(){
  connection.query("SELECT * FROM products", function(err, res){
    if(err) throw err;

    var table = new Table({
        head: ['ID', 'PRODUCT', 'DEPARTMENT', 'PRICE', 'QUANTITY']
    });
   
    for(var i = 0; i < res.length; i++){
      table.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity],
      );
    }
    console.log(table.toString());

    inquirer.prompt([
      {
        type: "input",
        message: "What is the ID of the product you'd like to add inventory to?",
        name: "item_id"
      },
      {
        type: "input",
        message: "How many would you like to add?",
        name: "newInventory"
      }
    ])
    .then(function(inquirerResponse) {
      var item_id = parseInt(inquirerResponse.item_id);
      var newInventory = parseInt(inquirerResponse.newInventory);

      connection.query("UPDATE products SET stock_quantity = stock_quantity + ? where item_id = ?",[newInventory, item_id], function(err, res){
        if(err) throw err;
        console.log("New inventory added!");
        menu();
      });
    });

  });

};

function newProduct(){
  inquirer.prompt([
    {
      type: "input",
      message: "Product?",
      name: "product_name"
    },
    {
      type: "input",
      message: "Department?",
      name: "department_name"
    },
    {
      type: "input",
      message: "Price?",
      name: "price"
    },
    {
      type: "input",
      message: "Quantity?",
      name: "stock_quantity"
    }
  ])
  .then(function(inquirerResponse) {
    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",[inquirerResponse.product_name, inquirerResponse.department_name, inquirerResponse.price, inquirerResponse.stock_quantity], function(err, res){
      if(err) throw err;
      console.log("Your product has been added!")
      menu();
    });
  });
};

function endConnection(){
  connection.end();
}