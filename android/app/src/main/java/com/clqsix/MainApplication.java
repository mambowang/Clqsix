package com.clqsix;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.hauvo.compress.RNCompressPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.RNThumbnailPackage;
import com.tkporter.sendsms.SendSMSPackage;
import cl.json.RNSharePackage;
import io.linkpreview.RNReactNativeLinkPreviewPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cl.json.ShareApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FIRMessagingPackage(),
            new ReactNativeContacts(),
            new RNCompressPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new RNThumbnailPackage(),
            SendSMSPackage.getInstance(),
            new RNReactNativeLinkPreviewPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new RCTCameraPackage(),
            new RNSharePackage()
      );
    }
  };
  @Override
  public String getFileProviderAuthority() {
    return "com.clqsix.provider";
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
