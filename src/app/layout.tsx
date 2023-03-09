import DependenciesContainer from './DependenciesContainer'
import dynamic from 'next/dynamic'
import '@solana/wallet-adapter-react-ui/styles.css'
import './globals.css'
import Backgrounds from './Backgrounds'

const MainMenu = dynamic(() => import('./MainMenu'), { ssr: false })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className='bg-black text-neutral-200'>
        <DependenciesContainer>
          <Backgrounds />
          <div className='fixed inset-0'>
            <div className='w-full h-full overflow-y-auto relative'>
              <div className='w-full h-full flex flex-col'>
                <div className='flex flex-auto relative overflow-hidden'>
                  {children}
                </div>
                <MainMenu />
              </div>
            </div>
          </div>
        </DependenciesContainer>
      </body>
    </html>
  )
}
