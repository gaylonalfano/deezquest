import { gameFunctions, playerKpAtom } from '@/atoms/gameStateAtom'
import { usePeer } from '@/atoms/peerAtom'
import { stageDimensionAtom, tileSizeAtom } from '@/atoms/stageDimensionAtom'
import { GameStateFunctions } from '@/enums/GameStateFunctions'
import { Keypair } from '@solana/web3.js'
import { useAtomValue, useSetAtom } from 'jotai'
import { FederatedPointerEvent, Texture } from 'pixi.js'
import { useCallback, useState } from 'react'
import { Sprite } from 'react-pixi-fiber'
import bs58 from 'bs58'
import { PeerMessages } from '@/enums/PeerMessages'

const cursorIcon = Texture.from(`/cursor.png`)

export default function StageCursor() {
  const [kp] = useState(
    (localStorage.getItem('demo_kp') &&
      Keypair.fromSecretKey(bs58.decode(localStorage.getItem('demo_kp')!))) ||
      null,
  )
  const { sendMessage } = usePeer(kp!)
  const playerKp = useAtomValue(playerKpAtom)
  const [opponent] = useState(localStorage.getItem('demo_opponent') || null)
  const gameFn = useSetAtom(gameFunctions)
  const tileSize = useAtomValue(tileSizeAtom)
  const { width, height } = useAtomValue(stageDimensionAtom)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null,
  )

  const onPointerUp = useCallback(
    (e: FederatedPointerEvent) => {
      const x = Math.floor(e.global.x / tileSize)
      const y = Math.floor(e.global.y / tileSize)
      let fired = 0 // TODO: BUG, setCursorPos firing twice

      setCursorPos((curr) => {
        fired++
        if (curr) {
          const distX = Math.abs(curr.x - x)
          const distY = Math.abs(curr.y - y)
          if (distX + distY === 1) {
            const origin = Math.min(curr.x, x) + Math.min(curr.y, y) * 8
            const dir = distX > distY ? 'h' : 'v'

            if (fired === 1) {
              const payload = {
                type: GameStateFunctions.INIT,
                data: {
                  publicKey: playerKp?.publicKey.toBase58(),
                  origin: dir + origin,
                  node1: { x: curr.x, y: curr.y },
                  node2: { x, y },
                },
              }
              gameFn(payload)
              opponent &&
                sendMessage(opponent, {
                  type: PeerMessages.GAME_TURN,
                  data: payload,
                })
            }
            return null
          }
        }

        if (!curr || !(curr.x === x && curr.y === y)) {
          return {
            x,
            y,
          }
        }

        return null
      })
    },
    [tileSize, opponent, playerKp, sendMessage],
  )

  return (
    <>
      {cursorPos && (
        <Sprite
          texture={cursorIcon}
          width={tileSize}
          height={tileSize}
          x={cursorPos.x * tileSize}
          y={cursorPos.y * tileSize}
        />
      )}
      <Sprite
        key={'pointer_capture'}
        interactive
        width={width}
        height={height}
        onpointerup={onPointerUp}
      />
    </>
  )
}
