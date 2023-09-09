KNOCKOUT BETS API

Server Processes

Login => Check Robot — Clean Query — Convert MD5 — Query DB
Signup => Check Robot — Clean Query — Query DB — Convert MD5 — Add to DB
Create User => Create Wallets — Create Username — Create Stats
Forgot Password => Check Robot — Clean Query  — Query DB — Email Person — Create Page
Check Session ID => Clean Query — Query DB
Create Session ID => Clean Query — Create String — Add to DB

Purchases
Purchase Streamview Stripe => Check Session ID — Request Stripe — Add SV+ to Account
Purchase Streamview Crypto => Check Session ID — Check Balance — Deduct Balance — Add SV+ to Account
Open Streamview => Query DB — Check SV+ on Acconunt — Return WatchLazy
Deposit Crypto => Query DB — Check Crypto Balance 
Deposit Fiat => Check Session ID — Request Stripe — Add Balance

Betting 
Place Bet => Check Session ID — Query DB — Check Balance — Deduct Balance — Write DB