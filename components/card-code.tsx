"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateCodeDocument } from "@/firebase/firestore/updateCodeDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import highlight from "@/utils/highlight"
import { Copy, Github, Loader2, Share, Star, Verified } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { cn } from "@/lib/utils"
import Loader from "@/components/loader"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import "prism-themes/themes/prism-one-dark.min.css"
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

export default function CardCode({
  id,
  idAuthor,
  language,
  code,
  description,
  tags,
  favoris: favorisInit,
  isPrivate,
  currentUser,
  comments,
}) {
  const notifyCodeCopied = () => toast.success("Code copied to clipboard")
  const notifyUrlCopied = () => toast.success("Url of code copied to clipboard")

  const searchParams = useSearchParams()

  const alertAddFavoris = () =>
    toast.custom((t) => (
      <div
        className="mt-4 rounded-lg border-2 border-yellow-800 bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
        role="alert"
      >
        <span className="font-medium">Warning alert!</span> Adding/deleting a
        bookmark takes time before it is visible on the screen, so please
        don&apos;t click many times.
      </div>
    ))

  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName
  const { login, isPending } = useGitHubLoign()

  const shareUrl = `https://sharuco.lndev.me/code-preview/${id}`

  const {
    data: dataAuthor,
    isLoading: isLoadingAuthor,
    isError: isErrorAuthor,
  } = useDocument(idAuthor, "users")

  const {
    data: dataCodes,
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
  } = useDocument(id, "codes")

  const { updateCodeDocument }: any = useUpdateCodeDocument("codes")

  const addCodeOnFavoris = async (id: string) => {
    let updatedCodeData = {
      favoris: favorisInit.includes(pseudo)
        ? favorisInit.filter((item) => item !== pseudo)
        : [...favorisInit, pseudo],
    }

    updateCodeDocument({ id, updatedCodeData })
  }

  return (
    <div key={id} className="flex flex-col gap-2">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-between">
        <Button
          variant="subtle"
          onClick={() => {
            copyToClipboard(code)
            notifyCodeCopied()
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy code
        </Button>
        <div className="flex items-center justify-start gap-2">
          {user ? (
            <Button
              onClick={() => {
                addCodeOnFavoris(id)
              }}
            >
              {user && favorisInit.includes(pseudo) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#F9197F"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#F9197F"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              ) : (
                <Star className="mr-2 h-4 w-4" />
              )}
              {favorisInit.length}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>
                  <Star className="mr-2 h-4 w-4" />
                  {favorisInit.length}
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
          {!isPrivate && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>
                  <Share className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Share this code on your social networks.
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="flex gap-2">
                  <FacebookShareButton
                    url={shareUrl}
                    quote={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                  >
                    <FacebookIcon size={38} round />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={shareUrl}
                    title={`I discovered this code on @sharuco_app , I share it with you here. - « ${description} »`}
                    hashtags={["CaParleDev", "ShareWithSharuco"]}
                  >
                    <TwitterIcon size={38} round />
                  </TwitterShareButton>
                  <LinkedinShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    source="https://sharuco.lndev.me"
                  >
                    <LinkedinIcon size={38} round />
                  </LinkedinShareButton>
                  <EmailShareButton
                    url={shareUrl}
                    subject={`Share code on sharuco.lndev.me`}
                    body={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                  >
                    <EmailIcon size={38} round />
                  </EmailShareButton>
                  <WhatsappShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                  >
                    <WhatsappIcon size={38} round />
                  </WhatsappShareButton>
                  <TelegramShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                  >
                    <TelegramIcon size={38} round />
                  </TelegramShareButton>
                  <Button
                    variant="subtle"
                    className="h-10 w-10 rounded-full p-0"
                    onClick={() => {
                      copyToClipboard(shareUrl)
                      notifyUrlCopied()
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
        <pre className="max-h-[480px] w-auto overflow-auto rounded-lg border border-slate-600 bg-slate-900 p-4 dark:bg-black">
          <code
            className="text-white"
            dangerouslySetInnerHTML={{
              __html: highlight(code, language),
            }}
          />
        </pre>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/${idAuthor}`}
          className="flex items-center justify-start gap-2"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            {isLoadingAuthor && (
              <AvatarFallback>
                <Loader />
              </AvatarFallback>
            )}
            {dataAuthor && dataAuthor.exists && (
              <>
                <AvatarImage
                  src={dataAuthor.data.photoURL}
                  alt={dataAuthor.data.displayName}
                />
                <AvatarFallback>
                  {dataAuthor.data.displayName.split(" ")[1] === undefined
                    ? dataAuthor.data.displayName.split(" ")[0][0] +
                      dataAuthor.data.displayName.split(" ")[0][1]
                    : dataAuthor.data.displayName.split(" ")[0][0] +
                      dataAuthor.data.displayName.split(" ")[1][0]}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <div className="flex items-center justify-start gap-1">
            <span className="text-md font-bold text-slate-700 hover:underline dark:text-slate-400 ">
              {idAuthor}{" "}
            </span>
            {dataAuthor && dataAuthor.exists && (
              <span>
                {dataAuthor.data.isCertified && (
                  <Verified className="h-4 w-4 text-green-500" />
                )}
              </span>
            )}
          </div>
        </Link>
        <span className="p-2 text-sm font-bold italic text-slate-700 dark:text-slate-400">
          {language.toLowerCase()}
        </span>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-400">
        {description}
      </p>
      <div className="mb-4 flex items-center justify-between gap-2">
        {tags && tags.length > 0 && (
          <div className="flex w-full flex-wrap items-center justify-start gap-2">
            {tags?.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-100 dark:bg-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {(searchParams.get("code-preview") === null && !isPrivate) && (
          <div className="shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/code-preview/${id}`}
                    className="flex gap-1 text-slate-700 dark:text-slate-400"
                  >
                    {comments.length}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                      />
                    </svg>

                    <span className="sr-only">Add or view</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add or View comments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}
