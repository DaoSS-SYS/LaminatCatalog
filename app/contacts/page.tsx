import { Header } from "@/components/Header";

export default function Contacts() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-8">
        <h1 className="text-2xl font-semibold">Контакты</h1>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-zinc-500">Телефон:</span> +7 903 755 56 29
              </div>
              <div>
                <span className="text-zinc-500">Почта:</span> jouravlev@bk.ru
              </div>
              <div>
                <span className="text-zinc-500">Адрес:</span> 55.613885, 37.485853, ряд Д, 13/5, ТОГК Славянский Мир,
                район Коммунарка, Новомосковский административный округ, Москва
              </div>
            </div>

            <div className="hr" />

            <div className="flex flex-wrap gap-2">
              <a className="btn" href="tel:+79037555629">
                Позвонить
              </a>
              <a className="btn" href="mailto:jouravlev@bk.ru">
                Написать
              </a>

              {/* удобно для клиентов: открыть карту в Яндексе */}
              <a
                className="btn"
                href="https://yandex.ru/maps/?pt=37.485853,55.613885&z=16&l=map"
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть в Яндекс Картах
              </a>
            </div>

            <div className="hr" />

            <div>
              <div className="label mb-2">Вывеска</div>
              <img
                src="/images/sign.png"
                alt="Вывеска магазина"
                className="w-full rounded-2xl border border-zinc-200 object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Яндекс карта */}
          <div className="card overflow-hidden flex">
           <iframe
            title="yandex-map"
            className="w-full h-full"
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A4ada1d5dd407ce0a33091e8e7244997c3784848fb468684d9ab5006fb737389b&amp;source=constructor"
            frameBorder={0}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
