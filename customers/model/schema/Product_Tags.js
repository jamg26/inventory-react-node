const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const ProductTagsSchema = new Schema({
    product_tag_name: String,
    product_tag_description: String,
    product_tag_active: {
        type: Boolean,
        default: true,
    },
    created_at: Date,
    updated_at: Date,
})
ProductTagsSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }

    next();
});

mongoose.model('product_tags', ProductTagsSchema);
