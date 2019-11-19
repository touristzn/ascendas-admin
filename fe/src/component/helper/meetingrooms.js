import { createModalHelper } from '../../util/modal';
import Booking from '../com/meetingrooms/booking';
import BookingList from '../com/meetingrooms/list-booking'

export let showBooking = createModalHelper(Booking);
export let showBookingList = createModalHelper(BookingList);