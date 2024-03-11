// const express = require(“express”);
// const app = express();
const AWS = require('aws-sdk');//npm install aws-sdk
require('dotenv').config();//npm install dotenv
const PORT = '3000';


exports.sendOTP = function(req, res) {

	var mobileNo = '+919356544353';
	
    var OTP = 1234;
   
   var params = {
   Message: 'Welcome! your mobile verification code is: ' + OTP +' Mobile Number is:' +mobileNo, /* required */
     PhoneNumber: mobileNo,
     };

    return new AWS.SNS({apiVersion: '2010–03–31'}).publish(params).promise()
		.then(message => {
			console.log('OTP SEND SUCCESS');
		 }).catch(err => {
		console.log('Error '+err)
		return err;
		});

	}
