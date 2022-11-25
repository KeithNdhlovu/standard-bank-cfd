import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type ITransaction = {
  trans_date_trans_time: string;
  cc_num: number;
  merchant: string;
  category: string;
  amt: string;
  first: string;
  last: string;
  gender: string;
  street: string;
  city: string;
  state: string;
  zip: number;
  lat: number;
  long: number;
  city_pop: number;
  job: string;
  dob: string;
  trans_num: string;
  unix_time: number;
  merch_lat: number;
  merch_long: number;
  is_fraud: number;
  id: number;
};

interface Props {
  transactions: ITransaction[];
}

const Transaction: NextPage<Props> = ({ transactions }) => {
  const { query } = useRouter();
  const id = query.id

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-primary">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-5/6 p-12 sm:mx-10 card shadow-xl bg-white relative overflow-hidden">
        <div className="grid min-h-[70vh] min-w-full max-w-7xl mx-auto">
          <div className="sm:text-center lg:text-left relative">
            <div className="bg-[url(logo.png)] bg-no-repeat bg-contain h-14 w-14"></div>

            <h1 className="text-3xl mt-5 tracking-wider font-extrabold text-gray-900">
              <span className="inline">Standard</span>
              <br />
              <span className="inline">Bank</span>{" "}
              <span className="text-white bg-primary rounded-lg px-3 xl:inline">
                CFD
              </span>
            </h1>

            <p className="text-sm font-semibold text-gray-900 mt-5 mb-2">Showing transactions for Card Number: {id}</p>

            <Link href="/" className="btn btn-primary text-white">
                Import Data
            </Link>

            <div className="overflow-x-auto w-full mt-10 max-h-[25rem]">
              <table className="table w-full">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th>Name</th>
                    <th>Merchant</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-bold">{`${transaction.first} ${transaction.last}`}</div>
                            <div className="text-sm opacity-50">
                              {transaction.job}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {transaction.merchant}
                        <br />
                        <span className="badge badge-ghost badge-sm">
                          {transaction.category}
                        </span>
                      </td>
                      <td>{transaction.trans_date_trans_time}</td>
                      <td>${transaction.amt}</td>
                      <th>
                        {transaction.is_fraud ? (
                          <span className="badge badge-error badge-md text-xs">
                            Fraud
                          </span>
                        ) : (
                          <span className="badge badge-success badge-md text-xs">
                            Legit
                          </span>
                        )}
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="h-11 w-11 bg-indigo-600 rounded-full absolute -right-2 -top-2"></div>
        <div className="h-5 w-5 bg-indigo-600 rounded-full absolute bottom-2 left-2"></div>
        <div className="h-10 w-10 bg-indigo-200 rounded-full absolute -left-2 -top-2"></div>
        <div className="h-40 w-40 bg-indigo-400 rounded-full absolute -right-10 -bottom-10"></div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`http://127.0.0.1:5001/api/list`);
  const transactions = (await res.json()) as ITransaction[];

  return {
    props: {
      transactions,
    },
  };
}

export default Transaction;
