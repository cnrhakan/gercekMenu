import React from "react";

function AboutUs() {
  return (
    <div className="relative min-h-screen flex flex-col items-start justify-start overflow-hidden my-8">
      {/* Saydam logo arka plan */}
      <img
        src="/gercekmenulogo.png"
        alt="Logo"
        className="pointer-events-none select-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 opacity-10 w-3/4 max-w-2xl z-0"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-3xl px-4">
        <h2 className="text-4xl my-5  font-bold">Hakkımızda</h2>
        <p>
          Son yıllarda artan enflasyonun da etkisiyle, bazı üretici ve satıcılar
          tarafından ürün ve hizmet fiyatlarında gereksiz ve orantısız artışlar
          yapıldığı insanlar tarafından tahmin edilmekte. Bu tür fahiş fiyat
          artışlarının önüne geçebilmek ve toplumda fiyat farkındalığını
          artırmak amacıyla bu projeyi geliştirdim.<br></br>
          <br></br> Proje, kullanıcıların restoran, kafe, market gibi tüketim
          alanlarında yaptıkları harcamaları, deneyimlerini ve gözlemlerini
          şeffaf bir şekilde paylaşmalarını sağlar. Böylece benzer ürün veya
          hizmetlerin hangi işletmelerde ne kadara sunulduğu,ne kadarlık süreçte
          ne denli artış gösterdiği kolayca görülebilir ve kullanıcılar bilinçli
          tercihler yapabilir.
          <br></br> <br></br> Amacım, tüketici olarak hepimizin sesini
          duyurabildiği, dayanışma içinde olduğu bir platform oluşturmak. Siz de
          deneyimlerinizi paylaşarak bu topluluğa katkıda bulunabilir, fahiş
          fiyatlarla mücadelede önemli bir rol oynayabilirsiniz.<br></br>
          <br></br>
          Unutmayın, bilinçli tüketici güçlü tüketicidir.
        </p>
        <div className="mt-16 mb-8">
          <div className="mb-4 text-base text-center">
            Bana ulaşmak için GitHub, LinkedIn veya e-posta üzerinden iletişime
            geçebilirsiniz.
          </div>
          <div className="flex justify-center items-center gap-10">
            {/* GitHub */}
            <a
              href="https://github.com/cnrhakan"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="transition-transform duration-200 rounded-full hover:scale-110 hover:-rotate-6 hover:bg-gray-100 p-2 shadow-none hover:shadow-lg"
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05 .89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
                  fill="#181717"
                />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/hakan-cinar/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="transition-transform duration-200 rounded-full hover:scale-110 hover:-rotate-6 hover:bg-gray-100 p-2 shadow-none hover:shadow-lg"
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"
                  fill="#0077B5"
                />
              </svg>
            </a>
            {/* Email */}
            <a
              href="mailto:hakan.440@hotmail.com"
              title="Mail"
              className="transition-transform duration-200 rounded-full hover:scale-110 hover:-rotate-6 hover:bg-gray-100 p-2 shadow-none hover:shadow-lg"
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"
                  fill="#EA4335"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
