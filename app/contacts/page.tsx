import { Header } from "@/components/Header";

const companyDetails = [
  { label: "Полное наименование", value: 'ООО "СоюзТорг-М"' },
  { label: "Сокращенное наименование", value: 'ООО "СТМ"' },
  {
    label: "Юридический адрес",
    value: "125445, г. Москва, ул. Беломорская, дом 40, стр 1, 3 этаж, пом. 25",
  },
  {
    label: "Фактический адрес",
    value: "125445, г. Москва, ул. Беломорская, дом 40, стр 1, 3 этаж, офис № 6",
  },
  {
    label: "Почтовый адрес",
    value: "125445, г. Москва, ул. Беломорская, дом 40, стр 1, 3 этаж, офис № 6",
  },
  { label: "Телефон", value: "+7 (495) 664-98-02" },
  { label: "Мобильный", value: "+7 (926) 190-98-02" },
  { label: "ИНН / КПП", value: "7724350764 / 774301001" },
  { label: "ОГРН", value: "1167746104107" },
  { label: "ОКВЭД", value: "51.13.2, 51.53, 51.53.1" },
  { label: "ОКПО", value: "52801057" },
  { label: "Банк", value: "ПАО «Сбербанк»" },
  { label: "Расчетный счет", value: "40702810238000120144" },
  { label: "Корр. счет", value: "30101810400000000225" },
  { label: "БИК", value: "044525225" },
  { label: "ЭДО (СБИС)", value: "2BE982f5e1fb521471fb60ed78585caa47c" },
  { label: "Генеральный директор", value: "Пивторак Алиса Владимировна" },
  { label: "Главный бухгалтер", value: "Пивторак Алиса Владимировна" },
];

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
                <span className="text-zinc-500">Адрес:</span> 55.613885, 37.485853, ряд Д, 13/5, ТОГК Славянский Мир, район Коммунарка, Новомосковский административный округ, Москва
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

          <div className="card overflow-hidden flex min-h-[420px]">
            <iframe
              title="yandex-map"
              className="w-full h-full"
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A4ada1d5dd407ce0a33091e8e7244997c3784848fb468684d9ab5006fb737389b&amp;source=constructor"
              frameBorder={0}
            />
          </div>
        </div>

        <section className="mt-8">
          <div className="card p-5">
            <h2 className="text-xl font-semibold">Реквизиты компании</h2>

            <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {companyDetails.map((item) => (
                    <tr key={item.label} className="border-b border-zinc-200 last:border-b-0">
                      <td className="w-[35%] bg-zinc-50 px-4 py-3 font-medium text-zinc-700 align-top">
                        {item.label}
                      </td>
                      <td className="px-4 py-3 text-zinc-900 break-words">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}