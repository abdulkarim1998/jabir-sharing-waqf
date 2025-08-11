import FooterLink from './FooterLink'
import Twitter from '@/assets/icons/Twitter'
import Instagram from '@/assets/icons/Instagram'
import Facebook from '@/assets/icons/Facebook'
import { HeaderProps } from '../header/Header'
import { Link } from 'react-router-dom'
import '../tailwind.scss'

const socials = [
  {
    icon: <Twitter />,
    link: 'https://twitter.com/jabirfoundation?lang=en',
  },
  {
    icon: <Instagram />,
    link: 'https://www.instagram.com/jabirfoundation/?hl=en',
  },
  { icon: <Facebook />, link: 'https://www.facebook.com/JabirFoundation/' },
]

const Footer = ({ links }: HeaderProps): JSX.Element => {
  const half = Math.ceil(links.length / 2)

  return (
    <div className="bg-[#392c45] text-[#F4F4F4] text-sm pt-14 pb-7 mt-7 tailwind-default">
      <div className="grid gap-10 items-center xl:items-start grid-cols-2 xl:grid-cols-4 max-w-72 mx-auto max-w-screen-2xl border-b solid border-[#A7A9AC]/20 pb-7 px-16 xl:!px-8">
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-bold !mb-3">روابط سريعة</h4>
          <div className="flex gap-9 w-full">
            <FooterLink links={links?.slice(0, half)} />
            <FooterLink links={links?.slice(half)} />
          </div>
        </div>

        <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
          <h4 className="font-bold">
            لكي تكون شريكا في مؤسسة الإمام جابر بن زيد الوقفية يمكنك التواصل على
            :
          </h4>
          <Link
            to="tel:+968-9781-1525"
            className="!underline hover:!underline-offset-2 text-white transition-all text-right"
            dir="ltr"
          >
            +968 9781 1525
          </Link>
          <Link
            className="!underline hover:!underline-offset-2 text-white transition-all text-right"
            to="mailto:info@jabirfoundation.om"
            dir="ltr"
          >
            info@jabirfoundation.om
          </Link>
        </div>

        <div>
          <h4 className="font-bold !mb-2">مواقع التواصل الإجتماعي</h4>
          <div className="text-[#E4A430] flex gap-4">
            {socials.map((social) => (
              <Link
                to={social.link}
                key={social.link}
                className="hover:text-[#F4F4F4] transition-all"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
        <div className="mr-auto grid grid-cols-1 sm:grid-cols-2 justify-end w-full gap-3">
          <div className="relative min-h-[62px]">
            <img
              src="/sohar-logo.svg"
              alt="بنك صحار"
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <div className="relative min-h-[62px]">
            <img
              src="/jf-logo-white.png"
              alt="مؤسسة الإمام جابر بن زيد الوقفية"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-2xl mt-7 px-8 flex lg:flex-row flex-col gap-5 justify-between items-center it ">
        <p> جميع الحقوق محفوظة © 2023 | مؤسسة الإمام جابر بن زيد الوقفية</p>
        <a href="https://rihal.om/">
          <img
            src="/img/PoweredByRihal.svg"
            alt="شركة رحال التقنية"
            width={184}
            height={52}
            className="object-contain"
          />
        </a>
      </div>
    </div>
  )
}

export default Footer
