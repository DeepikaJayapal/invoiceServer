const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: "*"
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "invoicebill",
})

app.post("/create", (req, res) => {

    const invoicenumber = req.body.invoicenumber;
    const date = req.body.date;
    const businessname = req.body.businessname;
    const clientAddress = req.body.clientAddress;
    const uen = req.body.uen;
    const mobilenumber = req.body.mobilenumber;
    const buyerordernumber = req.body.buyerordernumber;
    const dated = req.body.dated;
    const paymentterms = req.body.paymentterms;
    const productlist = req.body.productlist;
    const productname = req.body.productname;
    const hsncode = req.body.hsncode;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const amount = req.body.amount;
    const igsts = req.body.igsts;
    const grandtotal = req.body.grandtotal;
    const total = req.body.total;
    const lut = req.body.lut;
    const amountinwords = req.body.amountinwords;
    const mfr = req.body.mfr;
    const cgstrate = req.body.cgstrate;
    const igsttotal = req.body.igsttotal;
    const cgsttotal = req.body.cgsttotal;
    const finalamount = req.body.finalamount;
    const type = req.body.type;

    db.query("INSERT INTO invoicebill(invoicenumber,date,businessname,clientAddress,uen,mobilenumber,buyerordernumber,dated,paymentterms,amountinwords,total,lut,grandtotal,finalamount,type) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [invoicenumber, date, businessname, clientAddress, uen, mobilenumber, buyerordernumber, dated, paymentterms, amountinwords, total, lut, grandtotal, finalamount, type], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            // res.send('values inserted'+result.insertId)
            // res.send(productlist)
            productlist.forEach((element) => {
                // console.log(element)
                db.query("INSERT INTO productlist(productname,hsncode,quantity,price,amount,mfr,invoiceid,cgstrate,igsts,igsttotal,cgsttotal) VALUES(?,?,?,?,?,?,?,?,?,?,?)", [element.productname, element.hsncode, element.quantity, element.price, element.amount, element.mfr, result.insertId, element.cgstrate, element.igsts, element.igsttotal, element.cgsttotal], (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('values inserted')
                    }
                });
            });
        }
    });


});

app.get("/list", (req, res) => {

    db.query("SELECT * FROM invoicebill", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });

});

app.get("/view/:id", (req, res) => {
    db.query("SELECT * FROM `invoicebill` WHERE `id`= " + req.params.id, (error, result) => {
        if (error) {
            console.log(error);
        }
        var rows = JSON.parse(JSON.stringify(result[0]));
        db.query("SELECT * FROM `productlist` WHERE `invoiceid`= " + req.params.id, (error, result2) => {
            if (error) {
                console.log(error);
            }
            console.log(result2);
            rows.productlist = result2;
            res.send(JSON.stringify(rows));
        });
    });
});

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("INSERT INTO users(username,password) VALUES(?,?)", [username, password], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log("signed up successfully")
        }
    })
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            res.send(result)
        } else {
            res.send("Wrong combination of username and password")
        }
    })
});

app.post("/createpayslip", (req, res) => {
    const month = req.body.month;
    const name = req.body.name;
    const department = req.body.department;
    const dateOfJoining = req.body.dateOfJoining;
    const bankName = req.body.bankName;
    const bankAccountNumber = req.body.bankAccountNumber;
    const panNumber = req.body.panNumber;
    const workingDays = req.body.workingDays;
    const lopDays = req.body.lopDays;
    const salary = req.body.salary;
    const houseRentAllowance = req.body.houseRentAllowance;
    const conveyanceAllowance = req.body.conveyanceAllowance;
    const medicalAllowance = req.body.medicalAllowance;
    const specialAllowance = req.body.specialAllowance;
    const grossSalary = req.body.grossSalary;
    const pf = salary * 0.12;
    const incomeTax = req.body.incomeTax;
    const professionalTax = req.body.professionalTax;
    const lopAmount = req.body.lopAmount;
    const totalDeductions = req.body.totalDeductions;
    const netSalary = req.body.netSalary;

    db.query("INSERT INTO payslip(month,name,department,dateOfJoining,bankName,bankAccountNumber,panNumber,workingDays,lopDays,salary,houseRentAllowance,conveyanceAllowance,medicalAllowance,specialAllowance,grossSalary,pf,incomeTax,professionalTax,lopAmount,totalDeductions,netSalary) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[month,name,department,dateOfJoining,bankName,bankAccountNumber,panNumber,workingDays,lopDays,salary,houseRentAllowance,conveyanceAllowance,medicalAllowance,specialAllowance,grossSalary,pf,incomeTax,professionalTax,lopAmount,totalDeductions,netSalary],   (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send('values inserted')
        }
    });
});

app.get("/datas",(req,res) =>{
  
    db.query("SELECT * FROM payslip",(error,result) =>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    });
});


app.listen(4000, () => {
    console.log("Node JS Server is running on port 4000")
})