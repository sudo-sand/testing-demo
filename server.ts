import { serve } from "aleph/server";
import react from "aleph/plugins/react";
import unocss from "aleph/plugins/unocss";
import config from "~/unocss.config.ts";

import { getCookies } from "https://deno.land/std@0.181.0/http/cookie.ts";

serve({
  plugins: [
    react({ ssr: true }),
    unocss(config),
  ],
  middlewares: [
    {
      name: "My Auth",
      async fetch(request, context) {
        const url = new URL(request.url);
        if (url.pathname.startsWith("/admin")) {
          const { token } = getCookies(request.headers);
          if (!token || token !== "my-secret-token") {
            return new Response("redirect", {
              status: 301,
              headers: { "Location": "/" },
            });
          }
        }

        return await context.next();
      },
    },
  ],
});
