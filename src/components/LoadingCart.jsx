import React from "react";

export default function LoadingCart() {
  return (
    <div className="preloader" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "250px" }}>
      <style>{`
        .preloader .cart {
          display: block;
          margin: 0 auto;
          color: #22c55e;
        }
        .cart__track {
          stroke: hsla(0,10%,10%,0.1);
        }
        .cart__lines {
          stroke: #22c55e;
        }
        .cart__top {
          stroke-dasharray: 338 338;
          stroke-dashoffset: -338;
          animation: cart-top 1.5s cubic-bezier(.77,0,.18,1) infinite;
        }
        @keyframes cart-top {
          0% { stroke-dashoffset: -338; }
          45% { stroke-dashoffset: 0; }
          55% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 338; }
        }
        .cart__wheel1 .cart__wheel-stroke,
        .cart__wheel2 .cart__wheel-stroke {
          stroke-dasharray: 81.68 81.68;
          stroke-dashoffset: 81.68;
          animation: cart-wheel 1.5s cubic-bezier(.77,0,.18,1) infinite;
        }
        .cart__wheel1 .cart__wheel-stroke {
          animation-delay: 0.15s;
        }
        .cart__wheel2 .cart__wheel-stroke {
          animation-delay: 0.3s;
        }
        @keyframes cart-wheel {
          0% { stroke-dashoffset: 81.68; }
          10% { stroke-dashoffset: 81.68; }
          45% { stroke-dashoffset: 0; }
          55% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -81.68; }
        }
        .preloader__text {
          margin-top: 18px;
          text-align: center;
        }
        .preloader__msg {
          font-size: 18px;
          color: #222;
          font-weight: 500;
          margin: 0;
        }
        .preloader__msg--last {
          font-size: 14px;
          color: #888;
          margin-top: 8px;
          opacity: 0;
          animation: preloader-msg-fade 3s 2.5s forwards;
        }
        @keyframes preloader-msg-fade {
          to { opacity: 1; }
        }
      `}</style>
      <svg className="cart" role="img" aria-label="Shopping cart line animation" viewBox="0 0 128 128" width="128px" height="128px" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
          <g className="cart__track">
            <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
            <circle cx="43" cy="111" r="13" />
            <circle cx="102" cy="111" r="13" />
          </g>
          <g className="cart__lines">
            <polyline className="cart__top" points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
            <g className="cart__wheel1" transform="rotate(-90,43,111)">
              <circle className="cart__wheel-stroke" cx="43" cy="111" r="13" />
            </g>
            <g className="cart__wheel2" transform="rotate(90,102,111)">
              <circle className="cart__wheel-stroke" cx="102" cy="111" r="13" />
            </g>
          </g>
        </g>
      </svg>
      <div className="preloader__text">
        <p className="preloader__msg">Bringing you the goods…</p>
        <p className="preloader__msg preloader__msg--last">This is taking long. Something’s wrong.</p>
      </div>
    </div>
  );
}
