   // components/bottomnav.js  
   import React from 'react';  
   import { View, TouchableOpacity, StyleSheet } from 'react-native';  
   import { Link } from 'expo-router';  
   import Icon from 'react-native-vector-icons/Ionicons';  
  
   export default function ButtonNav() {  
     return (  
       <View style={styles.bottomBar}>  
         <Link href="/" asChild>  
           <TouchableOpacity style={styles.bottomBarButton} onPress={() => console.log("Home Pressed")}>  
             <Icon name="home" size={24} color="black" />  
           </TouchableOpacity>  
         </Link>  
         <Link href="/search" asChild>  
           <TouchableOpacity style={styles.bottomBarButton} onPress={() => console.log("Search Pressed")}>  
             <Icon name="search" size={24} color="black" />  
           </TouchableOpacity>  
         </Link>  
         <Link href="/bookmark" asChild>  
           <TouchableOpacity style={styles.bottomBarButton} onPress={() => console.log("Bookmark Pressed")}>  
             <Icon name="bookmark" size={24} color="black" />  
           </TouchableOpacity>  
         </Link>  
       </View>  
     );  
   }  
  
   const styles = StyleSheet.create({  
     bottomBar: {  
       position: 'absolute',  
       bottom: 0,  
       left: 0,  
       right: 0,  
       backgroundColor: '#fff',  
       flexDirection: 'row',  
       justifyContent: 'space-around',  
       alignItems: 'center',  
       paddingVertical: 10,  
       borderTopWidth: 1,  
       borderTopColor: '#ddd',  
     },  
     bottomBarButton: {  
       flex: 1,  
       alignItems: 'center',  
     },  
   });  
