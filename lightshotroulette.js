const express = require ( "express" );
const session = require ( "express-session" );
const { v4: uuidv4 } = require('uuid');
const rlib = require ( "request" );
const cheerio = require('cheerio');

const fetch = require ( "node-fetch" );


// const helmet = require ( "helmet" );
const compression = require ( "compression" );

const server = express ( );

server.use ( session ( { secret : uuidv4 ( ) , resave : false , saveUninitialized : false , cookie : { sameSite : "strict" , secure : false } } ) );

server.use ( compression ( ) );
// server.use ( helmet ( ) );

server.get ( "/" , async ( request , response ) => {
    
    const storage = "abcdefghijklmnopqrstuvwxyz0123456789";
    var result = "https://prnt.sc/";
    
    for ( i = 0; i < 6; i++ ) {
        result += storage.charAt ( Math.floor ( Math.random ( ) * storage.length ) );
    }
    
    console.log ( "result: " , result );

    rlib ( { url: result , headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0" } } , async ( err , res , body ) => {
        var $ = cheerio.load ( body );

        let allEls = $("*");

        let filteredEls = allEls.filter(function (i, el) {
            // this === el
            return $(this).attr()["id"] === "screenshot-image";
        });

        // console.log ( filteredEls );

        console.log ( "E" , res.statusCode );

        if ( filteredEls.length == 0 ) {
            console.log ( "301 HIT LENGTH 0" );
            response.redirect ( 301 , '/#' );
            return;
        }

        if ( filteredEls [ 0 ].attribs [ "src" ] === "//st.prntscr.com/2022/01/07/0148/img/0_173a7b_211be8ff.png" ) {
            console.log ( "301 SOURCE NOT FOUND" );

            response.redirect ( 301 , '/#' );
            return;
        }

        const img = await fetch ( filteredEls [ 0 ].attribs [ "src" ]);

        response.writeHead(200, {
            "content-type": "image/png"
          });

        return img.body.pipe(response);
        //response.sendStatus ( 200 );
    } );

	// response.sendStatus ( 200 );
} ).all ( ( request , response ) => {
	response.sendStatus ( 405 ); // refuse other methods
} );

server.listen ( 80 , ( ) => {
    console.log ( "ready" );
} );