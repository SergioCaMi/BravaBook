import mongoose from "mongoose";
const {Schema, model} = mongoose;

const apartmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rules: [String],
  rooms: {
    type: Number,
    required: true,
  },
  bedsPerRoom: [Number], // 2 en la primera habitación, 1 en la segunda, etc.
  bathrooms: Number,
  photos: [
    {
      url: String,
      description: String,
      isMain: Boolean,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  squareMeters: {
    type: Number,
    required: true,
  },
  services: {
    airConditioning: Boolean,
    heating: Boolean,
    accessibility: Boolean,
    television: Boolean,
    kitchen: Boolean,
    internet: Boolean,
  },
  location: {
    province: String,
    city: String,
    gpsCoordinates: {
      lat: Number,
      lng: Number,
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
});



const reservationSchema = new Schema({
  apartmentId: {
    type: Schema.Types.ObjectId,
    ref: "Apartment",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  guestName: {
    type: String,
    required: true,
  },
  guestEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed",
  },
});



const Reservation = model("Reservation", reservationSchema);
const Apartment = model("Apartment", apartmentSchema);

export { Apartment, Reservation };