# **Selfinity**

##### 会話の価値とお金の価値を結びつけるSNS ( https://selfinity.me/ )

![img](https://gitlab.com/Zakimiii/selfinity-web/raw/recommend-item/src/app/assets/images/selfinity-logo.png)

## Welcome to Selfinity

![img](https://selfinity.me/images/brands/ja/priceless-payment-lighting.png)

``Selfinity`` **はブロックチェーンを使って今まで価値化することができなかった会話という価値をお金にリンクさせるサービスです。**

Selfinity上ではオープンかつタイムリーに匿名で会話ができるオープンチャットメディアです。そこで生まれた会話にSelfinityというPlatformへの貢献度を数値化して、その割合で独自通貨という価値を報酬として与える **Contributes based Rewarding System(CBRS)** というシステムを使用しています。

## About Selfinity(web version) Technology selection

| Items             | Settings                                                |
| :---------------- | :------------------------------------------------------ |
| Program Languadge | Javascript \| Python3  \| Solidity                      |
| Framwork          | Webpack Node.js React.js \| Blockchain \| SmartContract |
| Architect         | Clean Architect with webpack and Redux-Saga             |
| Environment       | Docker CircleCI AWS Yarn NPM Ethereum PIP               |
| Role              | Frontend Backend API AI DAapps SupportSmartContract     |

![image-20190225170308032](https://camo.githubusercontent.com/5470df2e1b0e3e699d6d4710b35b81ec85717400/68747470733a2f2f63616d6f2e716969746175736572636f6e74656e742e636f6d2f643432363337646439303365343531663665656464323637646431396162323165653434323332342f363837343734373037333361326632663731363936393734363132643639366436313637363532643733373436663732363532653733333332653631366436313761366636653631373737333265363336663664326633303266333133333337333133323336326636363632333633313339333233323632326436313333363333393264333033323333333932643634333933333631326433363331333133373331333736313633363136343632363632653661373036353637)

## The algorithm of Contributes based Rewarding System(CBRS)

```math
A_i = \frac{\text{Valid Crypto Currency owned by user}}{\text{All valid Crypto Currency}} \hspace{3px} (A_i = 0.01 if A_i < 0.01 ) \\
B_i = A_i * \alpha * (- \frac{1}{n} * x_i + 1) \hspace{3px} (B_i = 0.001 \hspace{3px} if B_i < 0.001 ) \\
B^{good} = \sum_{i=1}^{n} (B_i * \theta) * \delta \\
B^{bad} = \sum_{i=1}^{n} (B_i) * \delta \\
Z_i = A_i + B^{good} - B^{bad} (Z_i = 0 if B^{bad} > 2 * B^{good} ) \\
Z^{boost} = \sum_{i=1}^{n} (Z_i * \zeta_i) (\zeta_i = 0.01 if Z^{boost} < 0.01 ) \\
\grave{Z_i} = A_i + B^{good} - B^{bad} + Z^{boost}(\grave{Z_i} = 0 if B^{bad} > 2 * B^{good} ) \\
```

```math
T_i = \frac{\text{Valid Crypto Currency owned by Savor}}{\text{Left Days}} \\
C_i = \frac{ \sum_{i=1}^{n} (\grave{Z_i}) }{ \text{All inflated Score per day} } \\
R_i = T_i * C_i
```

Variable roles are in berow list.

```math
A_i = \text{User score} \\
B_i = \text{Voter score} \\
B^{good} = \text{UpVote score} \\
B^{bad} = \text{DownVote score} \\
Z_i = \text{Content score} \\
Z^{boost} = \text{Boost score} \\
\grave{Z_i} = \text{Score of Content for boosts} \\
T_i  = \text{Supplyable Crypto Currency per day} \\
C_i  = \text{User degree of contribution per day} \\
R_i  = \text{Amount of user rewarding per day} \\
\alpha = \text{the parameter of validation voting. if invalid, }\alpha \text{ become 0.} \\
\theta = \text{the parameter of validation voting. if invalid, }\theta \text{ become 0.} \\
\delta = \text{the parameter of checking enough voting of number. if invalid, }\delta \text{ become 0.} \\
\zeta = \text{the parameter of user clearing the conditional of boosts, if invalid, }\zeta \text{ become 0.} \\
```

## Installation

#### Docker + CircleCI

Dockerを使うと速やかに本番環境モードでSelfinityを立ち上げることができます。ただし、現在サイトに公開してあるSelfinityのDocker Imageは非公開ですので、各々で環境変数を設定してContainerを起動してください。

```
docker run YOUR_DOCKER_USERNAME/selfinity_web
```

自分自身でDocker Imageをビルドする時はGithubからSelfinityをPCにCloneし、パラーメーター設定後、ビルドしてください。

````
git clone https://github.com/Selfinity/selfinity-web
cd selfinity-web
docker build .
````

## Useage

#### Clone the repository and make a tmp folder

````
git clone https://github.com/Selfinity/selfinity-web
cd selfinity-web
mkdir tmp
````

### Install dependencies on Javascript

````
nvm install v8.7
npm install -g yarn
yarn global add babel-cli
yarn install --frozen-lockfile
yarn run build
````

### Install dependencies on Python3(I recommend python versions of 3.6 or 3.7)

```
sudo pip3 install pipenv
sudo pipenv install
```

### Install mysql server(I recommend mysql -v >= 5.7)

````
brew update
brew doctor
brew upgrade
brew install mysql@5.7
brew link mysql@5.7 --force
mysql.server restart
````

### Setting mysql

```
sudo mysql -u root # you success this command, mysql successfully installed
DROP USER 'root'@'localhost';
CREATE USER 'root'@'%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

### Database migrations

migration時前にDatabaseの設定を行う必要があります。

`src/db/config/config.json`を変更することでどのDatabaseにどのような条件で接続できるかをPCに合わせて変更してください。

````
sudo npm install sequelize-cli -g
cd src/db
sudo sequelize db:drop && sudo sequelize db:create && sudo sequelize db:migrate
````

### Set Seed Data

````
cd src/db
sudo sequelize db:seed:all
````

もしシードデータのカスタマイズを行いたい時は``src/db/seeders ``と``src/db/test_data``配下のファイルを変更してください。

````javascript
const data = require('../test_data');
const results = data({
    users_limit: 100,
    contents_limit: 200,
    folows_limit: 3000,
    upvotes_limit: 3000,
    downvotes_limit: 3000,
    requests_limit: 104,
    requestings_limit: 52,
    requestUpvotes_limit: 3000,
    requestDownvotes_limit: 3000,
    reposts_limit: 100,
    labels_limit: 1,
    labelings_limit: 1,
    viewHistories_limit: 1000,
    searchHistories_limit: 1000,
    interests_limit: 100,
    homeLabels_limit: 100,
    children_limit: 600,
    labelStocks_limit: 100,
    developers_limit: 1,
    platforms_limit: 1,
    rewards_limit: 1,
    /*
    Edit this args of number. Seed data will be set by this numbers.
    */
});
````

### Set Selfinity Gateway API Key and Other Environment Variables

**$NODE_PATH/application/env/\$NODE_ENV/env.json** のファイルに様々な変数を定義することで環境変数を定義していきます。

SelfinityはURLへのアクセスの際は、KEYとPASSWORDの整合性次第でレスポンスを返すモジュールを作成しているので、シードデータを見て随時変更してください。

````json
"API": {
    "KEY": "API KEY of develop api_key colomn",
    "PASSWORD": "PASSWORD of decode in a develop password colomn"
}
````

### To run selfinity in production mode

```
sudo yarn run build
sudo yarn run production
```

### To run selfinity in development mode

```
sudo yarn run start
```

