var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  showProducts();

});

function showProducts(){
  connection.query("select * from products", function(err, res){
    if(err) throw err;
    for(var i = 0; i < res.length; i++){
      console.log("ID: " + res[i].item_id + " - Product: " + res[i].product_name);
    }
    ask();
  });

}

function ask(){
  inquirer.prompt([
    {
      type: "input",
      message: "What is the ID of the prduct you'd like to buy?",
      name: "item_id"
    },
    {
      type: "input",
      message: "How many would you like to purchase?",
      name: "quantity"
    }
  ])
  .then(function(inquirerResponse) {
    console.log(inquirerResponse);
    var item_id = parseInt(inquirerResponse.item_id);
    var quantity = parseInt(inquirerResponse.quantity);
    checkQuantity(item_id, quantity);
  });
};

function checkQuantity(item_id, quantity){
  connection.query("SELECT * FROM products WHERE item_id = ?",[item_id], function(err, res){
    if(err) throw err;
    console.log(res)
    if(res[0].stock_quantity >= quantity){
      console.log("there's enough");
      quantity = res[0].stock_quantity - quantity;
      console.log(quantity);
      updateQuantity(item_id, quantity);
      purchase(item_id, quantity);
    } else{
      console.log("Insufficient quantity!");
    }
  });
};

function updateQuantity(item_id, quantity){
  connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[quantity, item_id], function(err, res){
    if(err) throw err;
  });
};

function purchase(item_id, quantity){
  connection.query("SELECT * FROM products WHERE item_id = ?",[item_id], function(err, res){
    if(err) throw err;
    console.log(quantity);
    console.log(res[0].price);
    console.log("Your total is $" + res[0].price * parseInt(quantity));
    connection.end();
  });
};

