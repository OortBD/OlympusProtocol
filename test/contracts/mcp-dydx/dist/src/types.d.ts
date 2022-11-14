import BigNumber from 'bignumber.js';
import { Order } from '@dydxprotocol/exchange-wrappers';
import { TransactionReceipt, Log, EventLog } from 'web3/types';
export declare type address = string;
export declare type Integer = BigNumber;
export declare type Decimal = BigNumber;
export declare type BigNumberable = BigNumber | string | number;
export declare enum ConfirmationType {
    Hash = 0,
    Confirmed = 1,
    Both = 2,
    Simulate = 3
}
export declare const MarketId: {
    WETH: BigNumber;
    SAI: BigNumber;
    USDC: BigNumber;
    DAI: BigNumber;
    ETH: BigNumber;
};
export declare const Networks: {
    MAINNET: number;
    KOVAN: number;
};
export declare enum ProxyType {
    None = "None",
    Payable = "Payable",
    Sender = "Sender",
    Signed = "Sender"
}
export declare enum SigningMethod {
    Compatibility = "Compatibility",
    UnsafeHash = "UnsafeHash",
    Hash = "Hash",
    TypedData = "TypedData",
    MetaMask = "MetaMask",
    MetaMaskLatest = "MetaMaskLatest",
    CoinbaseWallet = "CoinbaseWallet"
}
export interface SoloOptions {
    defaultAccount?: address;
    confirmationType?: ConfirmationType;
    defaultConfirmations?: number;
    autoGasMultiplier?: number;
    defaultGas?: number | string;
    defaultGasPrice?: number | string;
    blockGasLimit?: number;
    accounts?: EthereumAccount[];
    apiEndpoint?: string;
    apiTimeout?: number;
    ethereumNodeTimeout?: number;
    wsOrigin?: string;
    wsEndpoint?: string;
    wsTimeout?: number;
}
export interface EthereumAccount {
    address?: string;
    privateKey: string;
}
export interface TxOptions {
    from?: address;
    value?: number | string;
}
export interface NativeSendOptions extends TxOptions {
    gasPrice?: number | string;
    gas?: number | string;
    nonce?: string | number;
}
export interface SendOptions extends NativeSendOptions {
    confirmations?: number;
    confirmationType?: ConfirmationType;
    autoGasMultiplier?: number;
}
export interface CallOptions extends TxOptions {
    blockNumber?: number;
}
export interface AccountOperationOptions {
    usePayableProxy?: boolean;
    proxy?: ProxyType;
    sendEthTo?: address;
}
export interface LogParsingOptions {
    skipOperationLogs?: boolean;
    skipAdminLogs?: boolean;
    skipPermissionLogs?: boolean;
    skipExpiryLogs?: boolean;
    skipFinalSettlementLogs?: boolean;
    skipRefunderLogs?: boolean;
    skipLimitOrdersLogs?: boolean;
    skipSignedOperationProxyLogs?: boolean;
}
export interface TxResult {
    transactionHash?: string;
    transactionIndex?: number;
    blockHash?: string;
    blockNumber?: number;
    from?: string;
    to?: string;
    contractAddress?: string;
    cumulativeGasUsed?: number;
    gasUsed?: number;
    logs?: Log[];
    events?: {
        [eventName: string]: EventLog;
    };
    nonce?: number;
    status?: boolean;
    confirmation?: Promise<TransactionReceipt>;
    gasEstimate?: number;
    gas?: number;
}
export declare enum AmountDenomination {
    Actual = 0,
    Principal = 1,
    Wei = 0,
    Par = 1
}
export declare enum AmountReference {
    Delta = 0,
    Target = 1
}
export declare enum ActionType {
    Deposit = 0,
    Withdraw = 1,
    Transfer = 2,
    Buy = 3,
    Sell = 4,
    Trade = 5,
    Liquidate = 6,
    Vaporize = 7,
    Call = 8
}
export declare enum AccountStatus {
    Normal = 0,
    Liquidating = 1,
    Vaporizing = 2
}
export interface Amount {
    value: Integer;
    denomination: AmountDenomination;
    reference: AmountReference;
}
export interface AccountAction {
    primaryAccountOwner: address;
    primaryAccountId: Integer;
}
interface ExternalTransfer extends AccountAction {
    marketId: Integer;
    amount: Amount;
}
export interface Deposit extends ExternalTransfer {
    from: address;
}
export interface Withdraw extends ExternalTransfer {
    to: address;
}
export interface Transfer extends AccountAction {
    marketId: Integer;
    toAccountOwner: address;
    toAccountId: Integer;
    amount: Amount;
}
export interface Exchange extends AccountAction {
    takerMarketId: Integer;
    makerMarketId: Integer;
    order: Order;
    amount: Amount;
}
export interface Buy extends Exchange {
}
export interface Sell extends Exchange {
}
export interface Trade extends AccountAction {
    autoTrader: address;
    inputMarketId: Integer;
    outputMarketId: Integer;
    otherAccountOwner: address;
    otherAccountId: Integer;
    amount: Amount;
    data: (string | number[])[];
}
export interface Liquidate extends AccountAction {
    liquidMarketId: Integer;
    payoutMarketId: Integer;
    liquidAccountOwner: address;
    liquidAccountId: Integer;
    amount: Amount;
}
export interface Vaporize extends AccountAction {
    vaporMarketId: Integer;
    payoutMarketId: Integer;
    vaporAccountOwner: address;
    vaporAccountId: Integer;
    amount: Amount;
}
export interface SetExpiry extends AccountAction {
    marketId: Integer;
    expiryTime: Integer;
}
export interface ExpiryV2Arg {
    accountOwner: address;
    accountId: Integer;
    marketId: Integer;
    timeDelta: Integer;
    forceUpdate: boolean;
}
export interface SetExpiryV2 extends AccountAction {
    expiryV2Args: ExpiryV2Arg[];
}
export interface Refund extends AccountAction {
    receiverAccountOwner: address;
    receiverAccountId: Integer;
    refundMarketId: Integer;
    otherMarketId: Integer;
    wei: Integer;
}
export interface DaiMigrate extends AccountAction {
    userAccountOwner: address;
    userAccountId: Integer;
    amount: Amount;
}
export interface AccountActionWithOrder extends AccountAction {
    order: LimitOrder | StopLimitOrder | CanonicalOrder;
}
export interface Call extends AccountAction {
    callee: address;
    data: (string | number[])[];
}
export interface AccountInfo {
    owner: string;
    number: number | string;
}
export interface ActionArgs {
    actionType: number | string;
    accountId: number | string;
    amount: {
        sign: boolean;
        denomination: number | string;
        ref: number | string;
        value: number | string;
    };
    primaryMarketId: number | string;
    secondaryMarketId: number | string;
    otherAddress: string;
    otherAccountId: number | string;
    data: (string | number[])[];
}
export interface Index {
    borrow: Decimal;
    supply: Decimal;
    lastUpdate: Integer;
}
export interface TotalPar {
    borrow: Integer;
    supply: Integer;
}
export interface Market {
    token: address;
    totalPar: TotalPar;
    index: Index;
    priceOracle: address;
    interestSetter: address;
    marginPremium: Decimal;
    spreadPremium: Decimal;
    isClosing: boolean;
}
export interface MarketWithInfo {
    market: Market;
    currentIndex: Index;
    currentPrice: Integer;
    currentInterestRate: Decimal;
}
export interface RiskLimits {
    marginRatioMax: Decimal;
    liquidationSpreadMax: Decimal;
    earningsRateMax: Decimal;
    marginPremiumMax: Decimal;
    spreadPremiumMax: Decimal;
    minBorrowedValueMax: Integer;
}
export interface RiskParams {
    marginRatio: Decimal;
    liquidationSpread: Decimal;
    earningsRate: Decimal;
    minBorrowedValue: Integer;
}
export interface Balance {
    tokenAddress: address;
    par: Integer;
    wei: Integer;
}
export interface Values {
    supply: Integer;
    borrow: Integer;
}
export interface BalanceUpdate {
    deltaWei: Integer;
    newPar: Integer;
}
export interface SetExpiry extends AccountAction {
    marketId: Integer;
    expiryTime: Integer;
}
export interface ExpiryV2Arg {
    accountOwner: address;
    accountId: Integer;
    marketId: Integer;
    timeDelta: Integer;
}
export interface SetExpiryV2 extends AccountAction {
    expiryV2Args: ExpiryV2Arg[];
}
export interface SetApprovalForExpiryV2 extends AccountAction {
    sender: address;
    minTimeDelta: Integer;
}
export declare enum ExpiryV2CallFunctionType {
    SetExpiry = 0,
    SetApproval = 1
}
export interface SignableOrder {
    makerAccountOwner: address;
    makerAccountNumber: Integer;
}
export interface SignedOrder extends SignableOrder {
    typedSignature: string;
}
export interface LimitOrder extends SignableOrder {
    makerMarket: Integer;
    takerMarket: Integer;
    makerAmount: Integer;
    takerAmount: Integer;
    takerAccountOwner: address;
    takerAccountNumber: Integer;
    expiration: Integer;
    salt: Integer;
}
export interface SignedLimitOrder extends LimitOrder, SignedOrder {
}
export interface StopLimitOrder extends LimitOrder {
    triggerPrice: Integer;
    decreaseOnly: boolean;
}
export interface SignedStopLimitOrder extends StopLimitOrder, SignedOrder {
}
export interface CanonicalOrder extends SignableOrder {
    isBuy: boolean;
    isDecreaseOnly: boolean;
    baseMarket: Integer;
    quoteMarket: Integer;
    amount: Integer;
    limitPrice: Decimal;
    triggerPrice: Decimal;
    limitFee: Decimal;
    expiration: Integer;
    salt: Integer;
}
export interface SignedCanonicalOrder extends CanonicalOrder, SignedOrder {
}
export declare enum LimitOrderStatus {
    Null = 0,
    Approved = 1,
    Canceled = 2
}
export interface LimitOrderState {
    status: LimitOrderStatus;
    totalMakerFilledAmount: Integer;
}
export interface CanonicalOrderState {
    status: LimitOrderStatus;
    totalFilledAmount: Integer;
}
export declare enum LimitOrderCallFunctionType {
    Approve = 0,
    Cancel = 1,
    SetFillArgs = 2
}
export interface OperationAuthorization {
    startIndex: Integer;
    numActions: Integer;
    expiration: Integer;
    salt: Integer;
    sender: address;
    signer: address;
    typedSignature: string;
}
export interface AssetAmount {
    sign: boolean;
    denomination: AmountDenomination;
    ref: AmountReference;
    value: Integer;
}
export interface Action {
    actionType: ActionType;
    primaryAccountOwner: address;
    primaryAccountNumber: Integer;
    secondaryAccountOwner: address;
    secondaryAccountNumber: Integer;
    primaryMarketId: Integer;
    secondaryMarketId: Integer;
    amount: AssetAmount;
    otherAddress: address;
    data: string;
}
export interface Operation {
    actions: Action[];
    expiration: Integer;
    salt: Integer;
    sender: address;
    signer: address;
}
export interface SignedOperation extends Operation {
    typedSignature: string;
}
export declare enum ApiOrderTypeV2 {
    LIMIT = "LIMIT",
    ISOLATED_MARKET = "ISOLATED_MARKET",
    STOP_LIMIT = "STOP_LIMIT",
    CANONICAL_CROSS = "CANONICAL_CROSS",
    CANONICAL_SPOT = "CANONICAL_SPOT",
    CANONICAL_SPOT_STOP_LIMIT = "CANONICAL_SPOT_STOP_LIMIT",
    CANONICAL_STOP_LIMIT = "CANONICAL_STOP_LIMIT",
    CANONICAL_ISOLATED_STOP_LIMIT = "CANONICAL_ISOLATED_STOP_LIMIT",
    CANONICAL_ISOLATED_OPEN = "CANONICAL_ISOLATED_OPEN",
    CANONICAL_ISOLATED_PARTIAL_CLOSE = "CANONICAL_ISOLATED_PARTIAL_CLOSE",
    CANONICAL_ISOLATED_FULL_CLOSE = "CANONICAL_ISOLATED_FULL_CLOSE",
    CANONICAL_ISOLATED_TAKE_PROFIT = "CANONICAL_ISOLATED_TAKE_PROFIT",
    PERPETUAL_CROSS = "PERPETUAL_CROSS",
    PERPETUAL_STOP_LIMIT = "PERPETUAL_STOP_LIMIT"
}
export declare enum ApiOrderType {
    LIMIT_V1 = "dydexLimitV1"
}
export declare enum ApiOrderStatus {
    PENDING = "PENDING",
    OPEN = "OPEN",
    FILLED = "FILLED",
    PARTIALLY_FILLED = "PARTIALLY_FILLED",
    CANCELED = "CANCELED",
    UNTRIGGERED = "UNTRIGGERED"
}
export declare enum ApiFillStatus {
    PENDING = "PENDING",
    REVERTED = "REVERTED",
    CONFIRMED = "CONFIRMED"
}
export declare enum ApiMarketName {
    WETH_DAI = "WETH-DAI",
    WETH_USDC = "WETH-USDC",
    DAI_USDC = "DAI-USDC"
}
export declare enum ApiOrderCancelReason {
    EXPIRED = "EXPIRED",
    UNDERCOLLATERALIZED = "UNDERCOLLATERALIZED",
    CANCELED_ON_CHAIN = "CANCELED_ON_CHAIN",
    USER_CANCELED = "USER_CANCELED",
    SELF_TRADE = "SELF_TRADE",
    FAILED = "FAILED",
    COULD_NOT_FILL = "COULD_NOT_FILL",
    POST_ONLY_WOULD_CROSS = "POST_ONLY_WOULD_CROSS"
}
export interface ApiOrderQueryV2 {
    accountOwner?: string;
    accountNumber?: Integer | string;
    status?: ApiOrderStatus[];
    market?: ApiMarketName[];
    side?: ApiSide;
    orderType?: ApiOrderTypeV2[];
    limit?: number;
    startingBefore?: Date;
}
export interface ApiOrderV2 extends ApiModel {
    uuid: string;
    id: string;
    status: ApiOrderStatus;
    accountOwner: string;
    accountNumber: string;
    orderType: ApiOrderTypeV2;
    fillOrKill: boolean;
    market: ApiMarketName;
    side: ApiSide;
    baseAmount: string;
    quoteAmount: string;
    filledAmount: string;
    price: string;
    cancelReason: ApiOrderCancelReason;
}
export interface ApiOrder extends ApiModel {
    id: string;
    uuid: string;
    rawData: string;
    orderType: ApiOrderType;
    pairUuid: string;
    makerAccountOwner: string;
    makerAccountNumber: string;
    makerAmount: string;
    takerAmount: string;
    makerAmountRemaining: string;
    takerAmountRemaining: string;
    price: string;
    fillOrKill: boolean;
    postOnly: boolean;
    status: ApiOrderStatus;
    expiresAt?: string;
    unfillableReason?: string;
    unfillableAt?: string;
    pair: ApiPair;
}
export interface ApiPair extends ApiModel {
    name: string;
    makerCurrencyUuid: string;
    takerCurrencyUuid: string;
    makerCurrency: ApiCurrency;
    takerCurrency: ApiCurrency;
}
export interface ApiCurrency extends ApiModel {
    symbol: string;
    contractAddress: string;
    decimals: number;
    soloMarket: number;
}
export interface ApiAccount extends ApiModel {
    owner: string;
    number: string;
    balances: {
        [marketNumber: string]: {
            par: string;
            wei: string;
            expiresAt?: string;
            expiryAddress?: string;
        };
    };
}
export interface ApiOrderOnOrderbook {
    id: string;
    uuid: string;
    amount: string;
    price: string;
}
export interface ApiFillQueryV2 {
    orderId?: string;
    side?: ApiSide;
    market?: Market[];
    transactionHash?: string;
    accountOwner?: string;
    accountNumber?: Integer | string;
    startingBefore?: Date;
    limit?: number;
}
export declare enum ApiLiquidity {
    TAKER = "TAKER",
    MAKER = "MAKER"
}
export interface ApiFillV2 extends ApiModel {
    transactionHash: string;
    status: ApiFillStatus;
    market: ApiMarketName;
    side: ApiSide;
    price: string;
    amount: string;
    orderId: string;
    accountOwner: string;
    accountNumber: string;
    liquidity: ApiLiquidity;
}
export interface ApiTradeQueryV2 {
    orderId?: string;
    side?: ApiSide;
    market?: ApiMarketName[];
    transactionHash?: string;
    accountOwner?: string;
    accountNumber?: Integer | string;
    startingBefore?: Date;
    limit?: number;
}
export interface ApiTradeV2 extends ApiModel {
    transactionHash: string;
    status: ApiFillStatus;
    market: ApiMarketName;
    side: ApiSide;
    price: string;
    amount: string;
    makerOrderId: string;
    makerAccountOwner: string;
    makerAccountNumber: string;
    takerOrderId: string;
    takerAccountOwner: string;
    takerAccountNumber: string;
}
export interface ApiMarket {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    name: string;
    symbol: string;
    supplyIndex: string;
    borrowIndex: string;
    totalSupplyPar: string;
    totalBorrowPar: string;
    lastIndexUpdateSeconds: string;
    oraclePrice: string;
    collateralRatio: string;
    marginPremium: string;
    spreadPremium: string;
    currencyUuid: string;
    currency: ApiCurrency;
    totalSupplyAPR: string;
    totalBorrowAPR: string;
    totalSupplyAPY: string;
    totalBorrowAPY: string;
    totalSupplyWei: string;
    totalBorrowWei: string;
}
interface ApiModel {
    uuid: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export declare enum OrderType {
    DYDX = "dydexLimitV1",
    ETH_2_DAI = "OasisV3",
    ZERO_EX = "0x-V2"
}
export declare enum ApiOrderUpdateType {
    NEW = "NEW",
    REMOVED = "REMOVED",
    UPDATED = "UPDATED"
}
export declare enum ApiSide {
    BUY = "BUY",
    SELL = "SELL"
}
export interface ApiOrderbookUpdate {
    type: ApiOrderUpdateType;
    id: string;
    side: ApiSide;
    amount?: string;
    price?: string;
}
export interface ApiMarketMessageV2 {
    name: Market;
    baseCurrency: {
        currency: ApiCurrency;
        decimals: number;
        soloMarketId: number;
    };
    quoteCurrency: {
        currency: ApiCurrency;
        decimals: number;
        soloMarketId: number;
    };
    minimumTickSize: BigNumber;
    minimumOrderSize: BigNumber;
    smallOrderThreshold: BigNumber;
    makerFee: BigNumber;
    largeTakerFee: BigNumber;
    smallTakerFee: BigNumber;
}
export declare enum RequestMethod {
    GET = "get",
    POST = "post",
    DELETE = "delete"
}
export declare const AccountNumbers: {
    [accountNumber: string]: BigNumber;
};
export declare enum OffChainAction {
    LOGIN = "Login",
    CANCEL_ALL = "CancelAll"
}
export {};
