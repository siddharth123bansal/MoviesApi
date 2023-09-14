const express = require("express");
const {prisma} = require("./connection");
const Joi = require('joi');
const app = express();