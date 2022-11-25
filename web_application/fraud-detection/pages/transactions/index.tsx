import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import getRawBody from "raw-body";
import { FormEventHandler, useRef, useState } from "react";

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
    predicted_label: number;
};

interface Props {
    transactions?: ITransaction[];
}

const Transaction: NextPage = () => {
    const { query } = useRouter();
    const id = query.id;
    const [payload, setPayload] = useState(new FormData())
    const [isLoading, setLoading] = useState(false)
    const [transactions, setTransactions] = useState([] as ITransaction[])

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        setLoading(true)

        _postTransactions()
    }

    const _postTransactions = async () => {

        const res = await fetch(`http://127.0.0.1:5001/api/predict`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: payload,
        })

        const transactions = (await res.json()) as ITransaction[]

        setLoading(false)
        setTransactions(transactions)
    }

    const _onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        const formData = new FormData()
        formData.append('file', file)

        setPayload(formData)
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-primary">
            <Head>
                <title>Transactions</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="h-5/6 p-12 min-w-[45rem] sm:mx-10 card shadow-xl bg-white relative overflow-hidden">
                <div className="grid min-h-[70vh] min-w-full justify-center max-w-7xl mx-auto">
                    <div className="sm:text-center lg:text-left relative">
                        <div className="bg-[url(logo.png)] mx-auto bg-no-repeat bg-contain h-14 w-14"></div>

                        <h1 className="text-3xl mt-5 text-center tracking-wider font-extrabold text-gray-900">
                            <span className="inline">Standard</span>
                            <br />
                            <span className="inline">Bank</span>{" "}
                            <span className="text-white bg-primary rounded-lg px-3 xl:inline">
                                CFD
                            </span>
                        </h1>

                        <div className="w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="mt-5 sm:mt-8 sm:flex justify-center">
                                    <input
                                        disabled={isLoading}
                                        name="transactions-file"
                                        type="file"
                                        onChange={_onFileSelected}
                                        className="bg-gray-100 p-5 pr-10 rounded-l-md outline-none w-2/3"
                                        placeholder="Credit card number"
                                    />
                                    <div className="rounded-md -ml-8 bg-gray-100 pr-2 flex items-center">
                                        <button
                                            type="submit"
                                            className="w-full flex shadow items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-focus"
                                        >
                                            {isLoading ? '... Loading' : 'Submit'}
                                        </button>
                                    </div>
                                </div>
                                {isLoading && <progress className="progress progress-primary  w-full"></progress>}
                            </form>
                        </div>

                        {transactions.length > 0 && (
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
                                                    {transaction.predicted_label ? (
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
                        )}

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

export default Transaction;
