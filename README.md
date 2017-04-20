# APP and GO Starter APP
This application is considered as a boilerplate that uses the best practices of Angular2 and Ionic2 Frameworks development process. 
## Features
- [Ionic Framework v2](https://ionicframework.com/docs/)
- [Angular 2](https://angular.io/)
- [angular2-acl](https://github.com/jsrockstar132/angular2-acl) Role-based permissions for AngularJS 2
- [ng2-restangular](https://github.com/2muchcoffeecom/ng2-restangular) Angular 2 service that simplifies common GET, POST, DELETE, and UPDATE requests
- [ng2-ui-auth](https://github.com/ronzeidman/ng2-ui-auth)
- [cordova-plugin-facebook4](https://github.com/jeduan/cordova-plugin-facebook4) Cordova native Facebook SDK plugin
- [cordova-plugin-googleplus](https://github.com/EddyVerbruggen/cordova-plugin-googleplus) Cordova native GooglePlus Auth SDK plugin
- [cordova-plugin-firebase](https://github.com/arnesson/cordova-plugin-firebase) Firebase Native Plugin(Database, Storage, Notifications..)
## Installation 
- Clone this repo
```
git clone https://github.com/HamzaouiMounir/appandgo.git
  
```
- Use node package manager to install all the depencendies 

```
npm install
  
```
### Notes about Ionic Build
This application is linked to a list of apis endpoint built in laravel for personal use, you can change your base URL in the ApiService Provider and use Restangular request operations to reach your endpoints.

## How to run the application 
- On your browser
```
ionic serve -l(optional)
  
```
- On your android/ios emulator

```
ionic platform add android
ionic platform add ios 
ionic emulate android 
ionic emulate ios
```
Attention: 
- To make sure that firebase notification messages are enabled
1. Go to [Firebase Console](https://console.firebase.google.com).
2. Create a new project.
3. Go to project settings and add android/ios app 
4. Make sure to put the application package name that you can find in the config.xml
5. Download GoogleServices-info.plist (for iOS) and GoogleServices.json (for Android)
6. Put these files under your_project_path 
7. Build your project

#License

```
Copyright (c) 2017 Mounir Hamzaoui- APP and GO
```
