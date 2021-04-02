import { useState, useEffect } from "react";
import Link from "next/link";
import {
	Divider,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Avatar,
    Spinner,
    Stat,
    StatHelpText,
    StatArrow,
    Tag,
} from "@chakra-ui/react";
import Head from 'next/head';

const Homepage = ({ data }) => {
    const [coins, setCoins] = useState([]);

    useEffect(() => {
        setCoins(data);
    }, []);

    return (
		<>
		<Head>
			<title>Cryptocurrency Stats</title>
			<meta name="description" content="Cryptocurrency Stats and Prices"></meta>
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		</Head>

        <Table
            variant="simple"
            size="md"
            border="1px"
            borderColor="gray.200"
            borderRadius="4"
            my={6}
            boxShadow="lg"
            p="6"
            rounded="md"
            bg="white"
        >
            <TableCaption>
				<a href="https://github.com/agustinl/crypto-stats" target="_blank">GitHub</a> &#8212; {new Date().getFullYear()} Crypto Stats
            </TableCaption>
            <Thead>
                <Tr>
                    <Th></Th>
                    <Th>Name</Th>
                    <Th>Symbol</Th>
                    <Th>Price</Th>
                    <Th>&#126; 1 hs</Th>
                    <Th>&#126; 24 hours</Th>
                    <Th>&#126; 7 days</Th>
                    <Th>&#126; 30 days</Th>
                    <Th>Market cap (USD)</Th>
                </Tr>
            </Thead>
            <Tbody>
                {coins.length ? (
                    coins.map((coin) => (
                        <Tr fontSize="sm" key={coin.id}>
                            <Td>
                                <Avatar
                                    size="sm"
                                    name={coin.name}
                                    src={coin.image}
                                    background="none"
                                />
                            </Td>
                            <Td>
                                <b>
                                    <Link
                                        href={`/coin/${encodeURIComponent(
                                            coin.id
                                        )}`}
                                    >
                                        {coin.name}
                                    </Link>
                                </b>
                            </Td>
                            <Td>
                                <Tag>{coin.symbol.toUpperCase()}</Tag>
                            </Td>
                            <Td>{coin.current_price.toLocaleString()} USD</Td>
                            <Td>
                                <Stat
                                    color={
                                        Math.sign(
                                            coin.price_change_percentage_1h_in_currency
                                        ) === 1
                                            ? "green.500"
                                            : "red.500"
                                    }
                                >
                                    <StatHelpText>
                                        <StatArrow
                                            type={
                                                Math.sign(
                                                    coin.price_change_percentage_1h_in_currency
                                                ) === 1
                                                    ? "increase"
                                                    : "decrease"
                                            }
                                        />
                                        {coin.price_change_percentage_1h_in_currency.toFixed(
                                            2
                                        )}
                                        %
                                    </StatHelpText>
                                </Stat>
                            </Td>
                            <Td>
                                <Stat
                                    color={
                                        Math.sign(
                                            coin.price_change_percentage_24h
                                        ) === 1
                                            ? "green.500"
                                            : "red.500"
                                    }
                                >
                                    <StatHelpText>
                                        <StatArrow
                                            type={
                                                Math.sign(
                                                    coin.price_change_percentage_24h
                                                ) === 1
                                                    ? "increase"
                                                    : "decrease"
                                            }
                                        />
                                        {coin.price_change_percentage_24h.toFixed(
                                            2
                                        )}
                                        %
                                    </StatHelpText>
                                </Stat>
                            </Td>
                            <Td>
                                <Stat
                                    color={
                                        Math.sign(
                                            coin.price_change_percentage_7d_in_currency
                                        ) === 1
                                            ? "green.500"
                                            : "red.500"
                                    }
                                >
                                    <StatHelpText>
                                        <StatArrow
                                            type={
                                                Math.sign(
                                                    coin.price_change_percentage_7d_in_currency
                                                ) === 1
                                                    ? "increase"
                                                    : "decrease"
                                            }
                                        />
                                        {coin.price_change_percentage_7d_in_currency.toFixed(
                                            2
                                        )}
                                        %
                                    </StatHelpText>
                                </Stat>
                            </Td>
                            <Td>
                                <Stat
                                    color={
                                        Math.sign(
                                            coin.price_change_percentage_30d_in_currency
                                        ) === 1
                                            ? "green.500"
                                            : "red.500"
                                    }
                                >
                                    <StatHelpText>
                                        <StatArrow
                                            type={
                                                Math.sign(
                                                    coin.price_change_percentage_30d_in_currency
                                                ) === 1
                                                    ? "increase"
                                                    : "decrease"
                                            }
                                        />
                                        {coin.price_change_percentage_30d_in_currency.toFixed(
                                            2
                                        )}
                                        %
                                    </StatHelpText>
                                </Stat>
                            </Td>
                            <Td>{coin.market_cap.toLocaleString()}</Td>
                        </Tr>
                    ))
                ) : (
                    <Spinner size="md" mx="auto" />
                )}
            </Tbody>
            <Tfoot>
                <Tr>
                    <Th></Th>
                    <Th>Name</Th>
                    <Th>Symbol</Th>
                    <Th>Price</Th>
                    <Th>&#126; 1 hour</Th>
                    <Th>&#126; 24 hours</Th>
                    <Th>&#126; 7 days</Th>
                    <Th>&#126; 30 days</Th>
                    <Th>Market cap (USD)</Th>
                </Tr>
            </Tfoot>
        </Table>
		</>
    );
};

export async function getStaticProps(context) {
    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets/?vs_currency=usd&per_page=20&price_change_percentage=1h,7d,30d`
    );
    const data = await res.json();

    if (!data) {
        return {
            notFound: true,
        };
    }

    return {
        props: { data }, // will be passed to the page component as props
    };
}

export default Homepage;
