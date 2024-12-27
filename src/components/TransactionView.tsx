"use client";

interface Transaction {
  type: string;
  amount: string;
  token: string;
  transactionHash: string;
}

interface TransactionViewProps {
  transactions: Transaction[] | null;
  loading: boolean;
  error: string | null;
}

export default function TransactionView({
  transactions,
  loading,
  error,
}: TransactionViewProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-24">
      <div className="flex justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
            Transactions
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : transactions && transactions.length > 0 ? (
            <div className="text-sm text-white">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border rounded border-gray-700 bg-gray-800"
                >
                  <p className="mb-2">
                    <span className="font-bold">Type:</span> {transaction.type}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">Amount:</span>{" "}
                    {transaction.amount}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">Token:</span>{" "}
                    {transaction.token}
                  </p>
                  <p>
                    <span className="font-bold">Transaction Hash:</span>{" "}
                    {transaction.transactionHash}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No transactions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
