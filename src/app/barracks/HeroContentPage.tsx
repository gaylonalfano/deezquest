'use client'

import { userWalletAtom } from '@/atoms/userWalletAtom'
import { Dialog } from '@/components/Dialog'
import WalletGuard from '@/components/WalletGuard'
import { Keypair } from '@solana/web3.js'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { HeroCard } from './HeroCard'
import HeroSelect from './HeroSelect'

interface HeroContentPageProps {
  basePath: string
}

export default function HeroContentPage({ basePath }: HeroContentPageProps) {
  const { connected } = useAtomValue(userWalletAtom)
  const router = useRouter()
  const sub = useMemo(
    () => `${basePath}/${Keypair.generate().publicKey.toBase58()}`,
    [basePath],
  )
  const [heroSelectOpen, setHeroSelectOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [newMintParams, setNewMintParams] = useState<{
    address: string
    tx: string
    image: string
  } | null>(null)

  if (!connected) {
    return <WalletGuard />
  }

  return (
    <>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='w-full max-h-full overflow-auto p-5'>
          <div className='p-5 rounded bg-neutral-900 shadow min-w-min max-w-sm w-full mx-auto  flex flex-col gap-5'>
            <h3 className='text-lg font-bold'>Welcome Adventurer!</h3>
            <p className='text-stone-300'>
              It seems that thou art a new arrival to these parts. Let us employ
              a fresh hero in thine stead!
            </p>
            <button
              type='button'
              className={classNames(
                'flex-auto px-3 py-2',
                'flex items-center justify-center',
                'bg-purple-700 hover:bg-purple-600 rounded',
              )}
              onClick={() => setHeroSelectOpen(true)}
            >
              Hire a Hero
            </button>
            <hr className='border-0 border-b border-white/5' />
            <p className='text-stone-300'>
              You can hire from a marketplace as well!
            </p>
            <div className='grid grid-cols-3 portrait:grid-cols-1 gap-2'>
              <a
                href='https://magiceden.io/popular-collections'
                target='_blank'
                rel='noreferrer'
                className={classNames(
                  'flex-auto p-2',
                  'flex items-center justify-center',
                  'bg-neutral-800 hover:bg-neutral-700 rounded',
                )}
              >
                <img
                  src='/magiceden.png'
                  className='flex-none h-6 object-contain'
                />
              </a>
              <a
                href='https://solsea.io/m/all'
                target='_blank'
                rel='noreferrer'
                className={classNames(
                  'flex-auto p-2',
                  'flex items-center justify-center',
                  'bg-neutral-800 hover:bg-neutral-700 rounded',
                )}
              >
                <img
                  src='/solsea.svg'
                  className='flex-none h-6 object-contain'
                />
              </a>
              <a
                href='https://solanart.io/collections'
                target='_blank'
                rel='noreferrer'
                className={classNames(
                  'flex-auto p-2',
                  'flex items-center justify-center',
                  'bg-neutral-800 hover:bg-neutral-700 rounded',
                )}
              >
                <img
                  src='/solanart.svg'
                  className='flex-none h-6 aspect-square object-contain'
                />
                <span className='text-sm font-bold ml-1'>Solanart</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* 
      <div className='w-screen sm:w-auto flex-auto overflow-y-auto overflow-x-hidden p-3 xl:p-5'>
      <div className='flex flex-wrap justify-center gap-3 xl:gap-5'>
        <HeroCard onClick={() => router.push(sub)} />
        <HeroCard onClick={() => router.push(sub)} />
        <HeroCard onClick={() => router.push(sub)} />
        <HeroCard onClick={() => router.push(sub)} />
        <HeroCard onClick={() => router.push(sub)} />
        <HeroCard onClick={() => router.push(sub)} />
        <HeroCard onClick={() => router.push(sub)} />
        <HeroCard onClick={() => router.push(sub)} />
      </div> 
      */}
      <Dialog
        title={'New Hero'}
        show={heroSelectOpen}
        className='max-w-3xl'
        onClose={() => setHeroSelectOpen(false)}
      >
        <HeroSelect
          onMint={(onMintParams) => {
            setNewMintParams(onMintParams)
            setSuccessOpen(true)
          }}
        />
      </Dialog>
      <Dialog
        title={'Hired a New Hero!'}
        show={successOpen && !!newMintParams}
        className='max-w-xs'
        onClose={() => setSuccessOpen(false)}
      >
        {newMintParams && (
          <div className='flex flex-col gap-5 px-5'>
            <div className='bg-black/20 w-60 h-60 mx-auto portrait:h-auto aspect-square relative overflow-hidden rounded'>
              <img
                src={newMintParams.image}
                className='w-full h-full object-contain '
              />
            </div>
            <q className='text-center'>
              I am a mercenary of the highest caliber, and my blade is at your
              service.
            </q>
            <div className='flex items-center justify-between'>
              <a
                target='_blank'
                rel='noreferrer'
                className='underline'
                href={`https://solscan.io/token/${newMintParams.address}?cluster=devnet`}
              >
                View Explorer
              </a>
              <a
                target='_blank'
                rel='noreferrer'
                className='underline'
                href={`https://solscan.io/tx/${newMintParams.tx}?cluster=devnet`}
              >
                View Transaction
              </a>
            </div>
            <div className='flex gap-3 justify-center pt-5 border-t border-t-white/5'>
              <button
                type='button'
                className={classNames(
                  'px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded flex items-center',
                )}
                onClick={() => {
                  setSuccessOpen(false)
                }}
              >
                Close
              </button>
              <button
                type='button'
                className={classNames(
                  'flex items-center justify-center',
                  'flex-auto px-3 py-2 bg-purple-700 hover:bg-purple-600 rounded',
                )}
                onClick={() => {
                  setSuccessOpen(false)
                  setHeroSelectOpen(false)
                  router.push(`${basePath}/${newMintParams.address}`)
                }}
              >
                View Hero
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  )
}
