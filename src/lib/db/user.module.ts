import {Schema} from 'mongoose';
import {Provider, Gender} from '../../app/authentication/enum/enum';
import {IUser} from '../interface/interface';
const schema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
    trtim: true,
    minlength: 2,
    maxlength: 20,
},

email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    toLowerCase: true
},
password: {
    type: String,
    required: function(this) {
        return this.provider === Provider.LOCAL;
    },
    trim: true,},
    provider: {
    type: Number,
    enum: Provider,
    default: Provider.LOCAL
    },

    gender: {
    type: String,
    enum: Gender,
    default: Gender.MALE
    },
isVerified: {                         
    type: Boolean,
    default: false,
  },
  twoStepVerification: {                 
    type: Boolean,
    default: false,
  },
})