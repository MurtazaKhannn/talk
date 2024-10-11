import VW from "../assets/pic-view.avif"
import MMK from "../assets/mmk.jpg"
import TW from "../assets/talk white.jpg"
import TB from "../assets/talk black.jpg"


let all_posts = [
    {
        title : "MY FIRST POST!!!" ,
        image : VW ,
        days : 3 ,
        likes : 256 ,
        comments : 147 ,
        user : {
            name : "Murtaza",
            profile_pic : MMK
        } , 
        caption : "My first post is about this picture that i took when i went to nowhere !!! hahahahhaha !!!" ,
        comment :{
            user : "Jazzzlan" ,

            commentList : [
             "thats some view" , 
             "Dope photo maaaan !! crazyy one" ,
             "Loved to see you back on this app brooo!!!"
            ]
        }
    } ,
    {
        title : "MY PICTURE" ,
        image : MMK ,
        days : 7 ,
        likes : 296 ,
        comments : 128 ,
        user : {
            name : "Murtaza",
            profile_pic : MMK
        } , 
        caption : "Am i not looking handsome ?? I know you cant reply with a no!!! " ,
        comment :{
            user : "Ishmeet" ,

            commentList : [
             "Loved to see you back on this app brooo!!!" , 
             "Dope photo maaaan !! crazyy one" ,
             "looking good"
            ]
        }
    } ,
    {
        title : "About my chat app" ,
        image : TW ,
        days : 9 ,
        likes : 396 ,
        comments : 228 ,
        user : {
            name : "Murtaza",
            profile_pic : MMK
        } , 
        caption : "This is my chat app i would love if you use this app !!!❤️" ,
        comment :{
            user : "Sahil" ,

            commentList : [
             "Dope photo maaaan !! crazyy one" , 
             "looking good" ,
             "Loved to see you back on this app brooo!!!"
            ]
        }
    } ,
    {
        title : "First Post" ,
        // image :  ,
        days : 9 ,
        likes : 396 ,
        comments : 228 ,
        user : {
            name : "Murtaza",
            profile_pic : MMK
        } , 
        caption : "This is my first Post!!!❤️" ,
        comment :{
            user : "Mohit" ,

            commentList : [
             "looking good" , 
             "Dope photo maaaan !! crazyy one" ,
             "Loved to see you back on this app brooo!!!"
            ]
        }
    }
]


export default all_posts;