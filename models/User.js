const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Please provide your Username!',
        trim: true
      },
      email: {
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email'
        },
        required: [true,'Please provide your name!']
      },
    thoughts: [],
    friends: [],
    },
    {
      toJSON: {
        virtuals: true,
        getters: true
      },
      id: false
});
// create the User model using the UserSchema
const User = model('User', UserSchema);

// get total count of comments and replies on retrieval
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
  });

// export the User model
module.exports = User;