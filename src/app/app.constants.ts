export const CONSTANTS={
 fileSource:{
   self:"Self",
   admin:"Admin",
   thirdParty:"ThirdParty"  
 },
 property_provider:{
   nestIo:"NIO"
 },
 listingType:{
   rent:1,
   sale:2,
   others:4
 },
 userRole:{
   renter:1,
   broker:2,
   landlord:4,
   others:8
 },
 propertyType:{
   residential:1
 },
 companyType:{
   brokersCompany:2,
   verificationCompany:4,
   providerCompany:8,
   renterCompany:1
 },
 jwtOptions:{
   expiresIn: '1h'  //expires in an hour
 },
 bookmarkStatus:{
   toBeApplied:1,
   applied:2,
   inProcess:4,
   approved:8,
   inActive:0
 },
//  bookmarkApplicationStatus:{
//    acceptedBroker:1,
//    approvedBroker:2,
//    acceptedLandlord:4,
//    approvedLandlord:8,
//    inActive:0
//  },
bookmarkApplicationStatus:{
   acceptedBroker:1,
   approvedBroker:2,
   docLoaded:4,
   docSigned:8,
   acceptedLandlord:16,
   approvedLandlord:32,
   leased:64,
   inActive:0
 },
 contractStatus:{
    created:1,
    leased:2,
    inActive:0
  },
 verificationStatus:{
   notReviewed:1,
   inComplete:2,
   inProcess:4,
   approved:8
 },
 rentalType:{
    prorate:1,
    fullMonth:2
  },
 bkmrkAppDocStatus:{
   toBeUploaded:1,
   uploaded:2,
   signed:4,
   inActive:0
 },
 paymentType:{
    subscription:1,
    monthly:2
  },
  // paymentInfoStatus:{
  //   active:1,               
  //   success:2,              
  //   pending:4,              
  //   processed:8,             
  //   subscribed:16,          
  //   inActive:0
  // },
  paymentInfoStatus:{
    active:1,              
    subscriptionEnabled:2,             
    monthlyEnabled:4,             
    processed:8,
    sendToLandlord:16,  
    receivedLandlord:32,        
    inActive:0
  },
}