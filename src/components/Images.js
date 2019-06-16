'use strict';

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TabBarIOS,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Images = {

  Camera: {
    ChooseLibrary: require('../assets/images/camera/ChooseLibrary-25x25.png'),
    Flash: require('../assets/images/camera/Flash-15x25.png'),
    Mute: require('../assets/images/camera/Mute-24x19.png'),
    RecordVideo: require('../assets/images/camera/RecordVideo-74x74.png'),
    Self: require('../assets/images/camera/Self-30x26.png'),
    Speaker: require('../assets/images/camera/Speaker-21x19.png'),
    TakePhoto: require('../assets/images/camera/TakePhoto-74x74.png'),
    Cancel_51x51: require('../assets/images/camera/cancle-51x51.png'),
    FlashIcon_42x66: require('../assets/images/camera/flashIcon-42x66.png'),
    Self_69x60: require('../assets/images/camera/self-69x60.png'),
    TakePhoto_228x228: require('../assets/images/camera/takePhoto-228x228.png'),
    stop_228x228: require('../assets/images/camera/stop-228x228.png'),
    record_228x228: require('../assets/images/camera/record-228x228.png'),
  },
  Add_Black_16x16: require('../assets/images/Add-Black-16x16.png'),
  Add_Gray_15x15: require('../assets/images/Add-Gray-15x15.png'),
  Add_Purple_16x16: require('../assets/images/Add-Purple-16x16.png'),
  Add_Purple_22x22: require('../assets/images/Add-Purple-22x22.png'),
  Add_White_15x15: require('../assets/images/Add-White-15x15.png'),  
  AddCircle_Purple_17x17: require('../assets/images/AddCircle-Purple-17x17.png'),
  BackChevron_Black_16x9: require('../assets/images/BackChevron-Black-16x9.png'),
  BackChevron_Gray_16x9: require('../assets/images/BackChevron-Gray-16x9.png'),
  BackChevronLeft_Black_9x16: require('../assets/images/BackChevronLeft-Black-9x16.png'),
  BackChevronLeft_White_9x16: require('../assets/images/BackChevronLeft-White-9x16.png'),
  BackChevronRight_Blue_9x16: require('../assets/images/BackChevronRight-Blue-6x11.png'),
  Cancel_Black_13x13: require('../assets/images/Cancel-Black-13x13.png'),
  Cancel_Red_15x15: require('../assets/images/Cancel-Red-15x15.png'),
  Cancel_White_13x13: require('../assets/images/Cancel-White-13x13.png'),
  CancelCircle_Gray_30x30: require('../assets/images/CancelCircle-Gray-30x30.png'),
  Check_Black_17x13: require('../assets/images/Check-Black-17x13.png'),
  Check_White_17x13: require('../assets/images/Check-White-17x13.png'),
  Cliqsix_14x14: require('../assets/images/Cliqsix-14x14.png'),
  Cliqsix_21x22: require('../assets/images/Cliqsix-21x22.png'),
  Cliqsix_26x26: require('../assets/images/Cliqsix-26x26.png'),
  Cliqsix_59x60: require('../assets/images/Cliqsix-59x60.png'),
  Cliqsix_1932x1952: require('../assets/images/Cliqsix-1932x1952.png'),
  Cliqsix_300x303: require('../assets/images/Cliqsix-300x303.png'),
  Cliqsix_150x150: require('../assets/images/Cliqsix-150x150.png'),  
  CliqueAvatar_Gray_180x180: require('../assets/images/CliqueAvatar-Gray-180x180.png'),
  Comment_Blue_17x17: require('../assets/images/Comment-Blue-17x17.png'),
  Discover_Gray_20x20: require('../assets/images/Discover-Gray-20x20.png'),
  Discover_White_20x20: require('../assets/images/Discover-White-20x20.png'),

  Dislike_Brown_17x17: require('../assets/images/Dislike-Brown-17x17.png'),
  Dislike_Gray_17x17: require('../assets/images/Dislike-Gray-17x17.png'),

  Down_Green_17x17: require('../assets/images/Done-Green-17x17.png'),

  Favorite_Black_23x21: require('../assets/images/Favorite-Black-23x21.png'),

  Home_Gray_21x21: require('../assets/images/Home-Gray-21x21.png'),
  Home_White_21x21: require('../assets/images/Home-White-21x21.png'),

  Like_Gray_17x17: require('../assets/images/Like-Gray-17x17.png'),
  Like_Red_17x17: require('../assets/images/Like-Red-17x17.png'),

  Location_Green_10x16: require('../assets/images/Location-Green-10x16.png'),

  Heart_Black_18x17: require('../assets/images/Heart-Black-18x17.png'),

  Inbox_Gray_20x20: require('../assets/images/Inbox-Gray-20x20.png'),
  Inbox_White_20x20: require('../assets/images/Inbox-White-20x20.png'),

  Notify_Gray_16x24: require('../assets/images/Notify-Gray-16x24.png'),
  Notify_White_16x24: require('../assets/images/Notify-White-16x24.png'),
  Profile_Gray_21x22: require('../assets/images/Profile-Gray-21x22.png'),
  Profile_Red_21x22: require('../assets/images/Profile-Red-21x22.png'),

  InfoCircle_Yellow_14x14: require('../assets/images/InfoCircle-Yellow-14x14.png'),

  LinkCircle_Blue_51x51: require('../assets/images/LinkCircle-Blue-51x51.png'),

  MessageCircle_Yellow_17x17: require('../assets/images/MessageCircle-Yellow-17x17.png'),

  More_Black_23x5: require('../assets/images/More-Black-23x5.png'),
  More_Gray_20x5: require('../assets/images/More-Gray-20x5.png'),

  NewMessage_Black_20x20: require('../assets/images/NewMessage-Black-20x20.png'),

  Options_Black_24x24: require('../assets/images/Options-Black-24x24.png'),

  PageActive_7x7: require('../assets/images/PageActive-7x7.png'),
  PageInactive_7x7: require('../assets/images/PageInactive-7x7.png'),

  Profile_Gray_21x21: require('../assets/images/Profile-Gray-21x21.png'),
  Profile_Gray_180x180: require('../assets/images/Profile-Gray-180x180.png'),
  Profile_White_21x21: require('../assets/images/Profile-White-21x21.png'),

  Refresh_Black_16x17: require('../assets/images/Refresh-Black-16x17.png'),

  Repost_Green_17x17: require('../assets/images/Repost-Green-17x17.png'),
  Repost_Green_18x14: require('../assets/images/Repost-Green-18x14.png'),

  Share_Yellow_17x17: require('../assets/images/Share-Yellow-17x17.png'),

  Search_Black_17x17: require('../assets/images/Search-Black-17x17.png'),

  Suggested_Black_17x11: require('../assets/images/Suggested-Black-17x11.png'),

  SwitchAccount_16x16: require('../assets/images/SwitchAccount-16x16.png'),

  UnreadMessage_Blue_7x7: require('../assets/images/UnreadMessage-Blue-7x7.png'),

  Upload_Gray_20x20: require('../assets/images/Upload-Gray-20x20.png'),
  Upload_White_19x19: require('../assets/images/Upload-White-19x19.png'),

  UploadComp_133x107: require('../assets/images/UploadComp-133x107.png'),
  
  UploadLink_51x41: require('../assets/images/UploadLink-51x41.png'),

  UploadMoment_247x46: require('../assets/images/UploadMoment-247x46.png'),

  UploadPhoto_70x70: require('../assets/images/UploadPhoto-70x70.png'),

  UploadText_60x45: require('../assets/images/UploadText-60x45.png'),

  UploadVideo_78x78: require('../assets/images/UploadVideo-78x78.png'),


  UploadLink: require('../assets/images/uploadLink.png'),

  UploadLibrary: require('../assets/images/uploadLibrary.png'),

  UploadGif: require('../assets/images/uploadGif.png'),

  UploadText: require('../assets/images/uploadText.png'),

  UploadVideo: require('../assets/images/uploadVideo.png'),

  Vibe_Blue_14x14: require('../assets/images/Vibe-Blue-14x14.png'),

  Welcome: require('../assets/images/Welcome/welcome.gif'),
  
  Share_Cliques_15x15: require('../assets/images/CreateClique/Share-15x15.png'),
  Create_Cliques_14x11: require('../assets/images/CreateClique/Create-14x11.png'),
  Default: require('../assets/images/Default.png'),
  Loading: require('../assets/images/Loading.png'),
  
  clique_grey_20x21: require('../assets/images/clique-grey-20x21.png'),
  clique_white_20x20: require('../assets/images/clique-white-20x20.png'),
  options_24x24: require('../assets/images/options-24x24.png'),
  setting_20x20: require('../assets/images/setting-20x20.png'),
  
  Create_14x19: require('../assets/images/Create-14x19.png'),
  Gift_14x13: require('../assets/images/gift-14x13.png'),
  Profile_15x15 : require('../assets/images/Profile-15x15.png'),
  member_Icon_50x50 : require('../assets/images/member-Icon-50x50.png'),
  contact_icon_50x50 : require('../assets/images/contact-icon-50x50.png'),
  sad_50x52 : require('../assets/images/sad-50x52.png'),
  back_Chevron_14x8 : require('../assets/images/back-Chevron-14x8.png'),
  more_23x5 : require('../assets/images/more-23x5.png'),
  profile_14x14 : require('../assets/images/profile-14x14.png'),
  reactions_116x25 : require('../assets/images/reactions-116x25.png'),
  upload_15x18 : require('../assets/images/upload-15x18.png'),
  right_go_6x10 : require('../assets/images/right-go-6x10.png'),
  splash : require('../assets/images/splash.gif'),
  //CLQSIX_LOGO : require('../assets/images/clqsix-logo.svg'),
  Start1 : require('../assets/images/Start/start1.png'),
  Start2 : require('../assets/images/Start/start2.png'),
  Start3 : require('../assets/images/Start/start3.png'),
  Start4 : require('../assets/images/Start/start4.png'),
  Start5 : require('../assets/images/Start/start5.png'),
  Logo : require('../assets/images/Logo.png'),
  Request_18x17:require('../assets/images/Request-18x17.png'),
  Request_150x105:require('../assets/images/request-150x105.png'),
  UnRequest_150x105:require('../assets/images/unRequest-150x105.png'),

  rectangle_15x3:require('../assets/images/rectangle-15x3.png'),
  check_17x13:require('../assets/images/check-17x13.png'),
  a_71x71:require('../assets/images/a-71x71.png'),
  
  notifications_26x24:require('../assets/images/notifications-26x24.png'),
  notify_55x60:require('../assets/images/notify-55x60.png'),
  heart_17x15:require('../assets/images/heart-17x15.png'),

  thumbnailSource_50x50:require('../assets/images/thumbnailSource-50x50.png'),
  search_40x40:require('../assets/images/search-40x40.png'),
  

  icon_24x28:require('../assets/images/icon-24x28.png'),
  group_22x37:require('../assets/images/group-22x37.png'),
  Search_blue_48x48:require('../assets/images/Search-blue-48x48.png'),
  contact_green_50x49:require('../assets/images/contact-green-50x49.png'),
  
  freq_12x18:require('../assets/images/freq-12x18.png'),
  desc_48x48:require('../assets/images/desc-48x48.png'),
  desc_16x16:require('../assets/images/desc-16x16.png'),  
  desc_14x14:require('../assets/images/desc-14x14.png'),


  comment_25x25:require('../assets/images/comment-25x25.png'),
  dislike_25x25:require('../assets/images/dislike-25x25.png'),
  followers_25x25:require('../assets/images/followers-25x25.png'),  


  like_25x25:require('../assets/images/like-25x25.png'),
  share_25x25:require('../assets/images/share-25x25.png'),

  oval_17x17:require('../assets/images/oval-17x17.png'),
  inactive_30x45:require('../assets/images/inactive-30x45.png'),
  MemberPhoto_390x390:require('../assets/images/MemberPhoto-390x390.png'),

  member_desc_14x14:require('../assets/images/member-desc-14x14.png'),
  member_name_15x15:require('../assets/images/member-name-15x15.png'),
  NoVisuals_165x165:require('../assets/images/NoVisuals-165x165.png'),

  Followers_500x500:require('../assets/images/Followers-500x500.png'),
  Following_500x500:require('../assets/images/Following-500x500.png'),
  Reactions_1720x500:require('../assets/images/Reactions-1720x500.png'),


  Comment_850x850:require('../assets/images/Comment-850x850.png'),
  
  Dislike_850x850:require('../assets/images/Dislike-850x850.png'),
  DislikeActive_850x850:require('../assets/images/DislikeActive-850x850.png'),

  FrequencyArrow_300x500:require('../assets/images/FrequencyArrow-300x500.png'),
  Like_850x850:require('../assets/images/Like-850x850.png'),
  LikeActive_850x850:require('../assets/images/LikeActive-850x850.png'),
  Share_850x850:require('../assets/images/Share-850x850.png'),



  Back_450x800:require('../assets/images/Back-450x800.png'),
  Cancel_650x650:require('../assets/images/Cancel-650x650.png'),
  CLQSIX_symbol_1300x1300:require('../assets/images/CLQSIX_symbol-1300x1300.png'),
  Create_clique_700x950:require('../assets/images/Create_clique-700x950.png'),




  FeaturedCliques_900x900:require('../assets/images/FeaturedCliques-900x900.png'),
  Friends_1200x1200:require('../assets/images/Friends-1200x1200.png'),
  Heart_950x900:require('../assets/images/Heart-950x900.png'),
  More_1125x250:require('../assets/images/More-1125x250.png'),



  Notifications_1000x1000:require('../assets/images/Notifications-1000x1000.png'),
  Settings_1000x1000:require('../assets/images/Settings-1000x1000.png'),
  Switch_700x450:require('../assets/images/Switch-700x450.png'),
  ViewCliqueInvites_750x750:require('../assets/images/ViewCliqueInvites-750x750.png'),


  CliquePage_Inactive_1575x1650:require('../assets/images/CliquePage-Inactive-1575x1650.png'),
  Home_Inactive_1575x1575:require('../assets/images/Home-Inactive-1575x1575.png'),
  Options_Inactive_1500x1500:require('../assets/images/Options-Inactive-1500x1500.png'),
  Search_Inactive_1500x1500:require('../assets/images/Search-Inactive-1500x1500.png'),
  Upload_1500x1500:require('../assets/images/Upload-1500x1500.png'),


  GIF_Icon_9880x2400:require('../assets/images/GIF-Icon-9880x2400.png'),
  NoVisualsPosted_8280x1380:require('../assets/images/NoVisualsPosted-8280x1380.png'),

  
  Photo_Icon_3500x3500:require('../assets/images/Photo-Icon-3500x3500.png'),
  Video_Icon_3900x3900:require('../assets/images/Video-Icon-3900x3900.png'),
  Visuals_1500x1500:require('../assets/images/Visuals-1500x1500.png'),

  Mood_Icon_14820x3300:require('../assets/images/Mood-Icon-14820x3300.png'),
  Text_Icon_7380x5940:require('../assets/images/Text-Icon-7380x5940.png'),

  Mood_Icon_3705x825:require('../assets/images/Mood-Icon-3705x825.png'),
  Photo_Icon_1050x1050:require('../assets/images/Photo-Icon-1050x1050.png'),
  Text_Icon_1845x1845:require('../assets/images/Text-Icon-1845x1845.png'),
  Video_Icon_1170x1170:require('../assets/images/Video-Icon-1170x1170.png'),
  Upload_White_20x20:require('../assets/images/Upload-White-20x20.png'),
  

  About_400x400:require('../assets/images/About-400x400.png'),
  BlockedUsers_400x400:require('../assets/images/BlockedUsers-400x400.png'),
  ChangePassword_350x450:require('../assets/images/ChangePassword-350x450.png'),
  Notifications_375x400:require('../assets/images/Notifications-375x400.png'),

  Link_475x475:require('../assets/images/Link-475x475.png'),
  Shirt_550x450:require('../assets/images/Shirt-550x450.png'),

  Link_2470x550:require('../assets/images/Link-2470x550.png'),
  LinkIcon_450x450:require('../assets/images/LinkIcon-450x450.png'),

  LinkIcon_30x30:require('../assets/images/LinkIcon-30x30.png'),
  Refresh_255x300:require('../assets/images/Refresh-255x300.png'),
  Notifications_300x300:require('../assets/images/Notifications-300x300.png'),
  MembersIcon_900x900:require('../assets/images/MembersIcon-900x900.png'),
  Request_Icon_270x240:require('../assets/images/Request_Icon-270x240.png'),
  Requests_Sent_750x255:require('../assets/images/Requests_Sent-750x255.png'),
  FaceMember_1800x1780:require('../assets/images/FaceMember-1800x1780.png'),
  
  MemberPhoto_2600x2600:require('../assets/images/MemberPhoto-2600x2600.png'),
  reaction_696x150:require('../assets/images/reaction-696x150.png'),

  start_596x591:require('../assets/images/start-596x591.png'),
  

  blank_start_594x592:require('../assets/images/blank-start-594x592.png'),
  Requests_Sent_750x525:require('../assets/images/Requests-Sent-750x525.png'),
  Requests_750x525:require('../assets/images/Requests-750x525.png'),
  
  Welcome_1080x1080:require('../assets/images/welcome-1080x1080.jpg'),
  
  RateReview_315x300:require('../assets/images/RateReview-315x300.png'),
  Feedback_252x228:require('../assets/images/Feedback-252x228.png'),
  welcome_562x616:require('../assets/images/welcome-562x616.png'),
  
  blank_250x250:require('../assets/images/blank-250x250.png'),
  Members_420x420:require('../assets/images/Members-420x420.png'),
  singlemain_664x668:require('../assets/images/singlemain-664x668.png'),
  option_1414x410:require('../assets/images/option-1414x410.png'),
  CliqueInvites_150x150:require('../assets/images/CliqueInvites-150x150.png'),
  Category_12x15:require('../assets/images/Category-12x15.png'),
  LocationIcon_100x150:require('../assets/images/LocationIcon-100x150.png'),
  
};


export default Images;