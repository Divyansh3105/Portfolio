import { CaseFooter, CaseHeader, Slab } from "./CaseChrome";

/**
 * The TalkSpace case study — a standalone page at /talkspace/.
 *
 * Same rule as the GravLang page: every excerpt below is copied out of the
 * repository rather than written for the page, and every number is counted
 * rather than estimated. If the source moves, this goes stale and should be
 * corrected, not quietly rounded.
 */

const REPO = "https://github.com/Divyansh3105/TalkSpace";
const LIVE = "https://talkspace-i5d2.onrender.com/";

const FACTS = [
  { value: "16", label: "REST endpoints" },
  { value: "4,337", label: "Lines of source" },
  { value: "61", label: "Source files" },
  { value: "6", label: "Months of work" },
];

/** The lifecycle of one edge in the friend graph. */
const STATES = [
  {
    n: "01",
    name: "Strangers",
    where: "no document",
    body: "Nothing exists. The absence of a row is the state — which is why every send has to prove the absence first, in both directions at once.",
  },
  {
    n: "02",
    name: "Pending",
    where: "FriendRequest { status: 'pending' }",
    body: "One document, with a sender and a recipient. The direction matters for what each side is shown, and it is the only thing that distinguishes declining from cancelling.",
  },
  {
    n: "03",
    name: "Friends",
    where: "status: 'accepted'  +  both users' friends[]",
    body: "Accepting writes twice: the request is marked accepted, and each user is pushed into the other's friends array. The row records how the edge came to exist; the arrays are the graph itself.",
  },
  {
    n: "04",
    name: "Withdrawn",
    where: "document deleted",
    body: "Declining and cancelling are the same delete, reached from opposite ends. Removing a friend is a different operation entirely — it pulls both arrays and leaves no request behind.",
  },
];

const LIMITS = [
  {
    title: "The sanitizer steps over arrays",
    body: "sanitizeObject recurses into nested objects but its type check is object && !Array.isArray, so an array falls through to the untouched branch. A string inside an array reaches the database with its tags intact. Nothing currently posts one, which is exactly why it would be easy to miss later.",
  },
  {
    title: "Rate limiting only covers /api/auth",
    body: "20 requests per 15 minutes per IP, which is the right shape for login and signup. The friend-request endpoints have none, so an authenticated account can enumerate sends as fast as it likes.",
  },
  {
    title: "Presence is seeded once, then trusted",
    body: "One queryUsers call establishes who is online, and after that the UI follows user.presence.changed events. A dropped socket means the dots stay as they were until something remounts the hook.",
  },
  {
    title: "Cold starts are the first impression",
    body: "The API sleeps on a free instance, so the first request after an idle period takes about twenty seconds. That is a hosting tier, not an architecture — but it is what a visitor actually experiences.",
  },
];

export default function TalkSpaceCase() {
  return (
    <>
      <CaseHeader />

      <main>
        {/* ── hero ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
            <p className="label-mono mb-8 text-blood">
              Case study &middot; Real-time platform
            </p>

            <h1 className="display-tight text-[clamp(3.2rem,13vw,9rem)]">
              Talk<span className="text-blood">Space</span>
            </h1>

            <p
              id="lede"
              className="mt-10 max-w-2xl text-[1.05rem] leading-[1.7] text-ink/80 md:text-[1.2rem]"
            >
              Chat is the easy half. The interesting half is that the state
              lives in three places at once — a social graph in MongoDB, the
              messaging and video session inside Stream&rsquo;s
              infrastructure, and a cache of both in the browser. Almost every
              decision below is really the same question: when these three
              disagree, which one is telling the truth?
            </p>

            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dd className="display-tight text-[2.6rem] tabular-nums md:text-[3.2rem]">
                    {fact.value}
                  </dd>
                  <dt className="label-mono mt-3 text-ink/45">{fact.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── the edge lifecycle ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              A friendship is
              <br />
              not a boolean
            </h2>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              It is an edge with a lifecycle, and the lifecycle is what the
              product is made of — the notification badge, the pending state on
              a button, the difference between declining and cancelling. Four
              states, and two different records describing them.
            </p>

            <div className="mt-12 border border-ink/15">
              {STATES.map((state, i) => (
                <article
                  key={state.n}
                  className={`p-6 md:p-8 ${i > 0 ? "border-t border-ink/15" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="label-mono bg-blood px-2 py-1 text-paper">
                      {state.n}
                    </span>
                    <span className="font-display text-[1.05rem] font-semibold">
                      {state.name}
                    </span>
                    <span className="ml-auto font-mono text-[0.72rem] text-graphite">
                      {state.where}
                    </span>
                  </div>

                  <p className="mt-6 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                    {state.body}
                  </p>

                  {state.n === "01" && (
                    <div className="mt-6 max-w-2xl">
                      <Slab>
                        {`const existingRequest = await FriendRequest.findOne({
  $or: [
    { sender: myId,        recipient: recipientId },
    { sender: recipientId, recipient: myId        },
  ],
});`}
                      </Slab>
                      <p className="mt-5 text-[0.94rem] leading-[1.75] text-graphite">
                        Checking only one direction is the bug that looks
                        correct. Without the{" "}
                        <span className="font-mono text-[0.9em] text-ink">
                          $or
                        </span>
                        , two people who happen to add each other at the same
                        time end up with two pending requests for one
                        friendship, and accepting either leaves the other
                        stranded forever.
                      </p>
                    </div>
                  )}

                  {state.n === "03" && (
                    <div className="mt-6 max-w-2xl">
                      <Slab>
                        {`friendRequest.status = "accepted";
await friendRequest.save();

await User.findByIdAndUpdate(friendRequest.sender, {
  $addToSet: { friends: friendRequest.recipient },
});
await User.findByIdAndUpdate(friendRequest.recipient, {
  $addToSet: { friends: friendRequest.sender },
});`}
                      </Slab>
                      <p className="mt-5 text-[0.94rem] leading-[1.75] text-graphite">
                        <span className="font-mono text-[0.9em] text-ink">
                          $addToSet
                        </span>{" "}
                        rather than{" "}
                        <span className="font-mono text-[0.9em] text-ink">
                          $push
                        </span>{" "}
                        because the write has to survive being run twice. A
                        double-tapped accept button, a retried request, a stale
                        client — any of them replays this, and a set does not
                        care.
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── decisions ── */}
        <section className="border-b border-ash bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              Four decisions
              <br />
              worth defending
            </h2>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              The parts where the obvious implementation is wrong, and why.
            </p>

            <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-14">
              {/* 1 */}
              <article className="min-w-0 border-l-2 border-blood pl-6 md:col-span-2">
                <h3 className="font-display text-[1.15rem] font-semibold leading-snug">
                  The password is excluded twice, because one exclusion
                  cannot see the other
                </h3>
                <p className="mt-4 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                  The schema marks it{" "}
                  <span className="font-mono text-[0.9em] text-ink">
                    select: false
                  </span>
                  , so no ordinary query returns the hash even if someone
                  forgets to exclude it. Login opts back in explicitly, at the
                  one place that genuinely needs it — the exception is visible
                  in the code rather than assumed.
                </p>
                <div className="mt-6 max-w-2xl">
                  <Slab>
                    {`// Models/User.js
password: { type: String, select: false }

// auth.controller.js — the one deliberate opt-in
const user = await User.findOne({ email }).select("+password -__v");`}
                  </Slab>
                </div>
                <p className="mt-5 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                  That protection has a hole, and it is not obvious.{" "}
                  <span className="font-mono text-[0.9em] text-ink">
                    select
                  </span>{" "}
                  is a Mongoose feature, and the recommendation query is not a
                  Mongoose query — it is an aggregation pipeline handed
                  straight to MongoDB.{" "}
                  <span className="font-mono text-[0.9em] text-ink">
                    $sample
                  </span>{" "}
                  returns whole documents, hash included, and the schema never
                  gets a say. So the pipeline strips them by hand:
                </p>
                <div className="mt-6 max-w-2xl">
                  <Slab>
                    {`// aggregates don't trigger mongoose selects
const sanitizedUsers = recommendedUsers.map((user) => {
  const { password, ...safeUser } = user;
  return safeUser;
});`}
                  </Slab>
                </div>
              </article>

              {/* 2 */}
              <article className="min-w-0 border-l-2 border-ink/20 pl-6">
                <h3 className="font-display text-[1.15rem] font-semibold leading-snug">
                  One friendship, two representations
                </h3>
                <p className="mt-4 text-[0.94rem] leading-[1.75] text-graphite">
                  The same relationship is stored as a{" "}
                  <span className="font-mono text-[0.9em] text-ink">
                    FriendRequest
                  </span>{" "}
                  document and as an entry in each user&rsquo;s{" "}
                  <span className="font-mono text-[0.9em] text-ink">
                    friends
                  </span>{" "}
                  array. That is duplication, and it is deliberate.
                </p>
                <p className="mt-4 text-[0.94rem] leading-[1.75] text-graphite">
                  They answer different questions. The document answers{" "}
                  <span className="text-ink">how did this edge come to be</span>{" "}
                  — who asked, who accepted, when — which is what the
                  notifications page is built from. The array answers{" "}
                  <span className="text-ink">who are this user&rsquo;s
                  friends right now</span>, which is asked on nearly every
                  screen and wants to be one indexed lookup, not a scan over a
                  request collection in two directions.
                </p>
                <p className="mt-4 text-[0.94rem] leading-[1.75] text-graphite">
                  The cost is that they can drift, so every transition writes
                  both, and both sides of every array.
                </p>
              </article>

              {/* 3 */}
              <article className="min-w-0 border-l-2 border-ink/20 pl-6">
                <h3 className="font-display text-[1.15rem] font-semibold leading-snug">
                  Declining and cancelling are the same row
                </h3>
                <p className="mt-4 text-[0.94rem] leading-[1.75] text-graphite">
                  Accepting is asymmetric — only the recipient may do it, and
                  the sender gets a 403. But deletion is not, because one
                  document serves two features: the recipient declining, and
                  the sender changing their mind.
                </p>
                <div className="mt-6">
                  <Slab>
                    {`// Both the sender (cancelling) and
// recipient (declining) may delete it
const isInvolved =
  friendRequest.recipient.toString() === req.user.id ||
  friendRequest.sender.toString()    === req.user.id;`}
                  </Slab>
                </div>
                <p className="mt-4 text-[0.94rem] leading-[1.75] text-graphite">
                  Writing the recipient-only check here by symmetry with accept
                  would have quietly removed the ability to withdraw a request.
                </p>
              </article>

              {/* 4 */}
              <article className="min-w-0 border-l-2 border-ink/20 pl-6 md:col-span-2">
                <h3 className="font-display text-[1.15rem] font-semibold leading-snug">
                  One socket, one owner
                </h3>
                <p className="mt-4 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                  Online dots need the same Stream connection the chat is
                  already using. Opening a second one works in development and
                  is wrong everywhere else — two sockets per tab, two presence
                  streams, and a race over which one disconnects last. The
                  presence hook attaches to the existing client instead, and
                  its cleanup deliberately does less than it looks like it
                  should:
                </p>
                <div className="mt-6 max-w-2xl">
                  <Slab>
                    {`client = StreamChat.getInstance(STREAM_API_KEY);
if (!client.userID) { /* connect only if nobody has */ }

return () => {
  mounted = false;
  handler?.unsubscribe?.();
  // Do NOT disconnect the client here — ChatPage owns the connection
};`}
                  </Slab>
                </div>
                <p className="mt-5 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                  A hook that borrows a resource has to unsubscribe from it
                  without closing it. Ownership is a decision someone has to
                  make explicitly, and the comment is there because the correct
                  code looks like an omission.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ── the token ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <div className="grid gap-10 md:grid-cols-12 md:gap-14">
              <div className="md:col-span-7">
                <h2 className="display-tight text-[clamp(2rem,6vw,3.6rem)]">
                  The secret never
                  <br />
                  reaches the browser
                </h2>
                <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
                  The browser has to talk to Stream directly — that is the
                  point of using it, and it is why messages and video do not
                  route through my server. But the API secret that authorises
                  those calls can never be shipped to it, because anything in a
                  bundle is public.
                </p>
                <p className="mt-5 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                  So the server keeps the secret and mints a token scoped to a
                  single user, behind the same auth middleware as everything
                  else. The client asks for one and gets a credential that can
                  only ever be itself.
                </p>
                <div className="mt-6 max-w-2xl">
                  <Slab>
                    {`// routes/chat.route.js
router.get("/token", protectRoute, getStreamToken);

// lib/stream.js — secret lives here, server-side only
export const generateStreamToken = (userId) =>
  streamClient.createToken(userId.toString());`}
                  </Slab>
                </div>
              </div>

              <aside className="md:col-span-5">
                <div className="border-l-2 border-blood bg-paper p-6">
                  <p className="label-mono mb-4 text-ink/45">
                    The index that needs a flag
                  </p>
                  <p className="text-[0.92rem] leading-[1.75] text-graphite">
                    Google sign-in stores a{" "}
                    <span className="font-mono text-[0.9em] text-ink">
                      googleId
                    </span>
                    , and it has to be unique. Declared unique alone, the first
                    password-only signup stores{" "}
                    <span className="font-mono text-[0.9em] text-ink">null</span>{" "}
                    and the second one collides with it — the index treats two
                    missing values as a duplicate.{" "}
                    <span className="font-mono text-[0.9em] text-ink">
                      sparse: true
                    </span>{" "}
                    leaves documents without the field out of the index
                    entirely.
                  </p>
                  <p className="mt-4 text-[0.92rem] leading-[1.75] text-graphite">
                    Signing in with Google using an email that already has a
                    password account links the two rather than creating a
                    second one.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── what I'd change ── */}
        <section className="border-b border-ash bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              What I&rsquo;d change
            </h2>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              Four things I know are wrong with it, which is a different list
              from the things I have fixed.
            </p>

            <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2">
              {LIMITS.map((limit) => (
                <div key={limit.title} className="bg-bone p-6">
                  <p className="font-display text-[1rem] font-semibold leading-snug">
                    {limit.title}
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-[1.7] text-graphite">
                    {limit.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CaseFooter repo={REPO} live={LIVE}>
          React 19 &middot; Node &middot; Express &middot; MongoDB &middot;
          Stream SDK &middot; Zod validation &middot; JWT in an httpOnly,
          SameSite=Strict cookie &middot; bcrypt &middot; TanStack Query
          &middot; installable PWA &middot; GitHub Actions for CI.
          <br />
          Every excerpt above is copied from the repository, and every figure
          is counted from it.
        </CaseFooter>
      </main>
    </>
  );
}
