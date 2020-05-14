const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const CompanySchema = new Schema({
    company_name: String,
    company_description: String,
    company_type: String,
    created_at: Date,
    updated_at: Date,
})
CompanySchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }

    next();
});

mongoose.model('companies', CompanySchema);
