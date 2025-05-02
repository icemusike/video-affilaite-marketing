import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json, redirect } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLocation, Link, useLoaderData, useActionData, useNavigation, Form } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useRef, useEffect } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
function isValidUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}
function sanitizeUrl(url) {
  if (!url) return "";
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.toString();
  } catch (e) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return sanitizeUrl(`https://${url}`);
    }
    return "";
  }
}
function AffiliateFrame({ affiliateUrl, className = "" }) {
  const sanitizedUrl = sanitizeUrl(affiliateUrl);
  if (!sanitizedUrl) {
    return /* @__PURE__ */ jsx("div", { className: `bg-gray-100 flex items-center justify-center rounded-lg ${className}`, children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Invalid affiliate URL" }) });
  }
  return /* @__PURE__ */ jsx("div", { className: `relative w-full overflow-hidden rounded-lg ${className}`, children: /* @__PURE__ */ jsx(
    "iframe",
    {
      src: sanitizedUrl,
      className: "w-full border-0 rounded-lg",
      style: { height: "500px" },
      title: "Affiliate content"
    }
  ) });
}
function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return /* @__PURE__ */ jsx("header", { className: "bg-white shadow", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex h-16 justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-shrink-0 items-center", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "text-xl font-bold text-blue-600", children: "VideoAffiliateHub" }) }),
      /* @__PURE__ */ jsx("nav", { className: "ml-6 flex items-center space-x-4", children: isAdmin ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/admin",
            className: `px-3 py-2 text-sm font-medium ${location.pathname === "/admin" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`,
            children: "Dashboard"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/admin/campaigns/new",
            className: `px-3 py-2 text-sm font-medium ${location.pathname === "/admin/campaigns/new" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`,
            children: "New Campaign"
          }
        )
      ] }) : null })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center", children: isAdmin ? /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100",
        children: "Exit Admin"
      }
    ) : /* @__PURE__ */ jsx(
      Link,
      {
        to: "/admin",
        className: "rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100",
        children: "Admin Panel"
      }
    ) })
  ] }) }) });
}
function getVideoProvider(url) {
  if (!url) return "unknown";
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  } else if (url.includes("vimeo.com")) {
    return "vimeo";
  }
  return "unknown";
}
function getYouTubeEmbedUrl(url) {
  var _a, _b;
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtube.com/watch")) {
    const urlParams = new URL(url).searchParams;
    videoId = urlParams.get("v") || "";
  } else if (url.includes("youtu.be/")) {
    videoId = ((_a = url.split("youtu.be/")[1]) == null ? void 0 : _a.split("?")[0]) || "";
  } else if (url.includes("youtube.com/embed/")) {
    videoId = ((_b = url.split("youtube.com/embed/")[1]) == null ? void 0 : _b.split("?")[0]) || "";
  }
  if (!videoId) return "";
  return `https://www.youtube.com/embed/${videoId}`;
}
function getVimeoEmbedUrl(url) {
  if (!url) return "";
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(vimeoRegex);
  const videoId = match ? match[1] : "";
  if (!videoId) return "";
  return `https://player.vimeo.com/video/${videoId}`;
}
function getEmbedUrl(url) {
  const provider = getVideoProvider(url);
  switch (provider) {
    case "youtube":
      return getYouTubeEmbedUrl(url);
    case "vimeo":
      return getVimeoEmbedUrl(url);
    default:
      return "";
  }
}
function isValidVideoUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return getVideoProvider(url) !== "unknown";
  } catch (e) {
    return false;
  }
}
function VideoEmbed({ videoUrl, className = "" }) {
  const embedUrl = getEmbedUrl(videoUrl);
  const provider = getVideoProvider(videoUrl);
  if (!embedUrl) {
    return /* @__PURE__ */ jsx("div", { className: `bg-gray-100 flex items-center justify-center rounded-lg ${className}`, children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Invalid video URL" }) });
  }
  return /* @__PURE__ */ jsx("div", { className: `relative w-full overflow-hidden rounded-lg ${className}`, style: { paddingTop: "56.25%" }, children: /* @__PURE__ */ jsx(
    "iframe",
    {
      src: embedUrl,
      className: "absolute top-0 left-0 w-full h-full border-0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowFullScreen: true,
      title: `${provider} video player`
    }
  ) });
}
let campaigns = [];
async function getCampaigns() {
  return campaigns;
}
async function getCampaign(id) {
  return campaigns.find((campaign) => campaign.id === id) || null;
}
async function createCampaign({ name, videoUrl, affiliateUrl }) {
  const id = Math.random().toString(36).substring(2, 9);
  const now = /* @__PURE__ */ new Date();
  const campaign = {
    id,
    name,
    videoUrl,
    affiliateUrl,
    createdAt: now,
    updatedAt: now
  };
  campaigns.push(campaign);
  return campaign;
}
async function updateCampaign(id, data) {
  const index = campaigns.findIndex((campaign2) => campaign2.id === id);
  if (index === -1) {
    return null;
  }
  const campaign = campaigns[index];
  const updatedCampaign = {
    ...campaign,
    ...data,
    updatedAt: /* @__PURE__ */ new Date()
  };
  campaigns[index] = updatedCampaign;
  return updatedCampaign;
}
async function loader$3({ params }) {
  const campaignId = params.campaignId;
  if (!campaignId) {
    throw new Response("Not Found", { status: 404 });
  }
  const campaign = await getCampaign(campaignId);
  if (!campaign) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ campaign });
}
function CampaignPreview() {
  const { campaign } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-gray-900", children: [
            "Preview: ",
            campaign.name
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-700", children: "This is how your campaign will look to visitors" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: `/admin/campaigns/${campaign.id}`,
              className: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              children: "Edit"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: `/c/${campaign.id}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              children: "View Live"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-gray-200 bg-white shadow", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-6 text-center text-2xl font-bold text-gray-900", children: campaign.name }),
        /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx(VideoEmbed, { videoUrl: campaign.videoUrl, className: "aspect-video" }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(AffiliateFrame, { affiliateUrl: campaign.affiliateUrl }) })
      ] }) })
    ] }) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CampaignPreview,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
function CampaignForm({
  defaultValues = {},
  mode: mode2 = "create"
}) {
  var _a, _b, _c, _d, _e, _f;
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const nameRef = useRef(null);
  const videoUrlRef = useRef(null);
  const affiliateUrlRef = useRef(null);
  useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.name) {
      (_b2 = nameRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.videoUrl) {
      (_d2 = videoUrlRef.current) == null ? void 0 : _d2.focus();
    } else if ((_e2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e2.affiliateUrl) {
      (_f2 = affiliateUrlRef.current) == null ? void 0 : _f2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ jsxs(Form, { method: "post", className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Campaign Name" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: nameRef,
            id: "name",
            name: "name",
            type: "text",
            defaultValue: defaultValues.name,
            required: true,
            "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.name) ? true : void 0,
            "aria-describedby": "name-error",
            className: "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          }
        ),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.name) && /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-red-600", id: "name-error", children: actionData.errors.name })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "videoUrl", className: "block text-sm font-medium text-gray-700", children: "Video URL (YouTube or Vimeo)" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: videoUrlRef,
            id: "videoUrl",
            name: "videoUrl",
            type: "url",
            defaultValue: defaultValues.videoUrl,
            required: true,
            "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.videoUrl) ? true : void 0,
            "aria-describedby": "videoUrl-error",
            className: "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            placeholder: "https://www.youtube.com/watch?v=..."
          }
        ),
        ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.videoUrl) && /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-red-600", id: "videoUrl-error", children: actionData.errors.videoUrl })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "affiliateUrl", className: "block text-sm font-medium text-gray-700", children: "Affiliate URL" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: affiliateUrlRef,
            id: "affiliateUrl",
            name: "affiliateUrl",
            type: "url",
            defaultValue: defaultValues.affiliateUrl,
            required: true,
            "aria-invalid": ((_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.affiliateUrl) ? true : void 0,
            "aria-describedby": "affiliateUrl-error",
            className: "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            placeholder: "https://jvzoo.com/affiliate/..."
          }
        ),
        ((_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.affiliateUrl) && /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-red-600", id: "affiliateUrl-error", children: actionData.errors.affiliateUrl })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: isSubmitting,
        className: "rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 disabled:bg-blue-300",
        children: isSubmitting ? "Saving..." : mode2 === "create" ? "Create Campaign" : "Update Campaign"
      }
    ) })
  ] });
}
async function loader$2({ params }) {
  const campaignId = params.campaignId;
  if (!campaignId) {
    throw new Response("Not Found", { status: 404 });
  }
  const campaign = await getCampaign(campaignId);
  if (!campaign) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ campaign });
}
async function action$1({ request, params }) {
  const campaignId = params.campaignId;
  if (!campaignId) {
    throw new Response("Not Found", { status: 404 });
  }
  const formData = await request.formData();
  const name = formData.get("name");
  const videoUrl = formData.get("videoUrl");
  const affiliateUrl = formData.get("affiliateUrl");
  const errors = {};
  if (!name || name.trim() === "") {
    errors.name = "Campaign name is required";
  }
  if (!videoUrl || videoUrl.trim() === "") {
    errors.videoUrl = "Video URL is required";
  } else if (!isValidVideoUrl(videoUrl)) {
    errors.videoUrl = "Please enter a valid YouTube or Vimeo URL";
  }
  if (!affiliateUrl || affiliateUrl.trim() === "") {
    errors.affiliateUrl = "Affiliate URL is required";
  } else if (!isValidUrl(affiliateUrl)) {
    errors.affiliateUrl = "Please enter a valid URL";
  }
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  const campaign = await updateCampaign(campaignId, { name, videoUrl, affiliateUrl });
  if (!campaign) {
    throw new Response("Not Found", { status: 404 });
  }
  return redirect(`/admin/campaigns/${campaign.id}`);
}
function EditCampaign() {
  const { campaign } = useLoaderData();
  useActionData();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Edit Campaign" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-700", children: "Update your video affiliate campaign" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-white p-6 shadow", children: /* @__PURE__ */ jsx(
        CampaignForm,
        {
          defaultValues: {
            name: campaign.name,
            videoUrl: campaign.videoUrl,
            affiliateUrl: campaign.affiliateUrl
          },
          mode: "edit"
        }
      ) }) })
    ] }) })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: EditCampaign,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const videoUrl = formData.get("videoUrl");
  const affiliateUrl = formData.get("affiliateUrl");
  const errors = {};
  if (!name || name.trim() === "") {
    errors.name = "Campaign name is required";
  }
  if (!videoUrl || videoUrl.trim() === "") {
    errors.videoUrl = "Video URL is required";
  } else if (!isValidVideoUrl(videoUrl)) {
    errors.videoUrl = "Please enter a valid YouTube or Vimeo URL";
  }
  if (!affiliateUrl || affiliateUrl.trim() === "") {
    errors.affiliateUrl = "Affiliate URL is required";
  } else if (!isValidUrl(affiliateUrl)) {
    errors.affiliateUrl = "Please enter a valid URL";
  }
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  const campaign = await createCampaign({ name, videoUrl, affiliateUrl });
  return redirect(`/admin/campaigns/${campaign.id}`);
}
function NewCampaign() {
  useActionData();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Create New Campaign" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-700", children: "Set up a new video affiliate campaign" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-white p-6 shadow", children: /* @__PURE__ */ jsx(CampaignForm, {}) }) })
    ] }) })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: NewCampaign
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({ params }) {
  const campaignId = params.campaignId;
  if (!campaignId) {
    throw new Response("Not Found", { status: 404 });
  }
  const campaign = await getCampaign(campaignId);
  if (!campaign) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ campaign });
}
function CampaignPage() {
  const { campaign } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg bg-white shadow", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-6 text-center text-3xl font-bold text-gray-900", children: campaign.name }),
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx(VideoEmbed, { videoUrl: campaign.videoUrl, className: "aspect-video" }) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(AffiliateFrame, { affiliateUrl: campaign.affiliateUrl }) })
  ] }) }) }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CampaignPage,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function CampaignCard({ campaign }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow", children: /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900", children: campaign.name }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-center text-sm text-gray-500", children: /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
      "Created: ",
      new Date(campaign.createdAt).toLocaleDateString()
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex space-x-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: `/admin/campaigns/${campaign.id}`,
          className: "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          children: "Edit"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: `/admin/campaigns/${campaign.id}/preview`,
          className: "inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          children: "Preview"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: `/c/${campaign.id}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center rounded-md border border-transparent bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          children: "View Live"
        }
      )
    ] })
  ] }) });
}
async function loader({ request }) {
  const campaigns2 = await getCampaigns();
  return json({ campaigns: campaigns2 });
}
function AdminIndex() {
  const { campaigns: campaigns2 } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "sm:flex sm:items-center sm:justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Campaigns" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-700", children: "Manage your video affiliate campaigns" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-8", children: campaigns2.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border-2 border-dashed border-gray-300 p-12 text-center", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            className: "mx-auto h-12 w-12 text-gray-400",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No campaigns" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Get started by creating a new campaign." }),
        /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/admin/campaigns/new",
            className: "inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "-ml-0.5 mr-1.5 h-5 w-5",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx("path", { d: "M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" })
                }
              ),
              "New Campaign"
            ]
          }
        ) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: campaigns2.map((campaign) => /* @__PURE__ */ jsx(CampaignCard, { campaign }, campaign.id)) }) })
    ] }) })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminIndex,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "VideoAffiliateHub - Seamlessly Combine Videos with Affiliate Links" },
    { name: "description", content: "Create beautiful landing pages that combine YouTube or Vimeo videos with your affiliate links." }
  ];
};
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl", children: [
          /* @__PURE__ */ jsx("span", { className: "block", children: "Video + Affiliate Marketing" }),
          /* @__PURE__ */ jsx("span", { className: "block text-blue-600", children: "Made Simple" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl", children: "Create beautiful landing pages that combine YouTube or Vimeo videos with your affiliate links." }),
        /* @__PURE__ */ jsx("div", { className: "mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8", children: /* @__PURE__ */ jsx("div", { className: "rounded-md shadow", children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/admin",
            className: "flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg",
            children: "Go to Admin Panel"
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-16", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600", children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6", children: [
            /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" }),
            /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" })
          ] }) }),
          /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-medium text-gray-900", children: "YouTube & Vimeo Support" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Easily embed videos from YouTube or Vimeo to engage your audience." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" }) }) }),
          /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-medium text-gray-900", children: "JVZoo Integration" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Seamlessly integrate your JVZoo affiliate links below your videos." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600", children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "h-6 w-6", children: [
            /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" }),
            /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" })
          ] }) }),
          /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-medium text-gray-900", children: "Easy Admin Panel" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Manage all your campaigns from a simple, intuitive admin dashboard." })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-gray-500", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " VideoAffiliateHub. All rights reserved."
    ] }) }) })
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C0vi2C2z.js", "imports": ["/assets/components-VzBhDqgv.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-B-4SkMfG.js", "imports": ["/assets/components-VzBhDqgv.js"], "css": ["/assets/root-CDXuO98t.css"] }, "routes/admin.campaigns.$campaignId.preview": { "id": "routes/admin.campaigns.$campaignId.preview", "parentId": "routes/admin.campaigns.$campaignId", "path": "preview", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.campaigns._campaignId.preview-BYgyt_ht.js", "imports": ["/assets/components-VzBhDqgv.js", "/assets/VideoEmbed-Bv-Nnjj5.js", "/assets/Header-BYc8mJCz.js"], "css": [] }, "routes/admin.campaigns.$campaignId": { "id": "routes/admin.campaigns.$campaignId", "parentId": "root", "path": "admin/campaigns/:campaignId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.campaigns._campaignId-D6Iu8mYq.js", "imports": ["/assets/components-VzBhDqgv.js", "/assets/CampaignForm-BcJlU7ss.js", "/assets/Header-BYc8mJCz.js"], "css": [] }, "routes/admin.campaigns.new": { "id": "routes/admin.campaigns.new", "parentId": "root", "path": "admin/campaigns/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.campaigns.new-BjVaJdEZ.js", "imports": ["/assets/components-VzBhDqgv.js", "/assets/CampaignForm-BcJlU7ss.js", "/assets/Header-BYc8mJCz.js"], "css": [] }, "routes/c.$campaignId": { "id": "routes/c.$campaignId", "parentId": "root", "path": "c/:campaignId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/c._campaignId-Pj8QXjlc.js", "imports": ["/assets/components-VzBhDqgv.js", "/assets/VideoEmbed-Bv-Nnjj5.js"], "css": [] }, "routes/admin._index": { "id": "routes/admin._index", "parentId": "root", "path": "admin", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin._index-uNOJkUAW.js", "imports": ["/assets/components-VzBhDqgv.js", "/assets/Header-BYc8mJCz.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-D-hv7V-3.js", "imports": ["/assets/components-VzBhDqgv.js", "/assets/Header-BYc8mJCz.js"], "css": [] } }, "url": "/assets/manifest-f5d22d1b.js", "version": "f5d22d1b" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/admin.campaigns.$campaignId.preview": {
    id: "routes/admin.campaigns.$campaignId.preview",
    parentId: "routes/admin.campaigns.$campaignId",
    path: "preview",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/admin.campaigns.$campaignId": {
    id: "routes/admin.campaigns.$campaignId",
    parentId: "root",
    path: "admin/campaigns/:campaignId",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/admin.campaigns.new": {
    id: "routes/admin.campaigns.new",
    parentId: "root",
    path: "admin/campaigns/new",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/c.$campaignId": {
    id: "routes/c.$campaignId",
    parentId: "root",
    path: "c/:campaignId",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/admin._index": {
    id: "routes/admin._index",
    parentId: "root",
    path: "admin",
    index: true,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
