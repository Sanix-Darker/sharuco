"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import getCollections from "@/firebase/firestore/getCollections"
import { useToast } from "@/hooks/use-toast"
import copyToClipboard from "@/utils/copyToClipboard"
import delinearizeCode from "@/utils/delinearizeCode"
import highlight from "@/utils/highlight"
import indentCode from "@/utils/indentCode"
import { Copy, Github, Loader2, Share, Star } from "lucide-react"
import Prism from "prismjs"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ToastAction } from "@/components/ui/toast"
import "prism-themes/themes/prism-one-dark.min.css"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import { useQuery } from "react-query"
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"

export default function CardCode({
  id,
  idAuthor,
  language,
  code,
  description,
  tags,
}) {
  const { toast } = useToast()
  const { user } = useAuthContext()
  const { login, isPending } = useGitHubLoign()

  const shareUrl = `https://shacuro.lndev.me/code-preview/${id}`

  return (
    <div key={id} className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Button
          variant="subtle"
          onClick={() => {
            copyToClipboard(code)
            toast({
              title: "Copied to clipboard",
              description: "The code has been copied to your clipboard",
              action: (
                <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
              ),
            })
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy code
        </Button>
        <div className="flex items-center justify-start gap-2">
          {user ? (
            <Button>
              <Star className="mr-2 h-4 w-4" />0
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>
                  <Star className="mr-2 h-4 w-4" />0
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Like a Code to share the love.
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Join Sharuco now to let{" "}
                    <Link
                      href={`/${idAuthor}`}
                      className="font-semibold text-slate-900 dark:text-slate-100"
                    >
                      {idAuthor}
                    </Link>{" "}
                    know you like.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                    )}
                    disabled={isPending}
                    onClick={login}
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Github className="mr-2 h-4 w-4" />
                    )}
                    Login with Github
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Share className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Like a Code to share the love.
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="flex gap-2">
                    <FacebookShareButton
                      url={shareUrl}
                      quote={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here`}
                    >
                      <FacebookIcon size={38} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                      url={shareUrl}
                      title={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here.`}
                      hashtags={["CaParleDev", "ShareWithSharuco"]}
                    >
                      <TwitterIcon size={38} round />
                    </TwitterShareButton>
                    <LinkedinShareButton
                      url={shareUrl}
                      title={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                      source="https://shacuro.lndev.me"
                    >
                      <LinkedinIcon size={38} round />
                    </LinkedinShareButton>
                    <EmailShareButton
                      url={shareUrl}
                      subject={`Share code on shacuro.lndev.me`}
                      body={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                    >
                      <EmailIcon size={38} round />
                    </EmailShareButton>
                    <WhatsappShareButton
                      url={shareUrl}
                      title={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                    >
                      <WhatsappIcon size={38} round />
                    </WhatsappShareButton>
                    <TelegramShareButton
                      url={shareUrl}
                      title={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                    >
                      <TelegramIcon size={38} round />
                    </TelegramShareButton>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg">
        <pre className="w-auto overflow-x-auto rounded-lg border border-slate-600 bg-slate-900 p-4 dark:bg-black">
          <code
            className="text-white"
            dangerouslySetInnerHTML={{
              __html: highlight(code, language),
            }}
          />
        </pre>
      </div>
      <Link
        href={`/${idAuthor}`}
        className="flex items-center justify-start gap-2"
      >
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="@ln_dev7" />
          <AvatarFallback>LN</AvatarFallback>
        </Avatar>
        <span className="text-md font-bold text-slate-700 hover:underline dark:text-slate-400 ">
          {idAuthor}
        </span>
      </Link>
      <p className="text-sm text-slate-700 dark:text-slate-400">
        {description}
      </p>
      <div className="flex items-center justify-start gap-2">
        {tags?.map((tag: string) => (
          <span
            key={tag}
            className="rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-100 dark:bg-slate-600 dark:text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
