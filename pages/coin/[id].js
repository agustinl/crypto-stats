import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Flex,
    Heading,
    Breadcrumb,
    BreadcrumbItem,
    Divider,
    Avatar,
    Box,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Badge,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import Head from 'next/head';

const Coin = () => {
    const [coin, setCoin] = useState({});
    const [lastUpdate, setLastUpdate] = useState("");

    const [prices, setPrices] = useState([]);
    const [hours, setHours] = useState([]);

    const router = useRouter();
    const {
        query: { id },
    } = router;

    var keys = []
    var labels = []

    const data = {
        labels: hours,
        datasets: [
            {
                label: "Price",
                data: prices,
                fill: true,
                backgroundColor: "rgb(104,211,145, 0.2)",
                borderColor: "rgba(104,211,145,1)",
            },
        ],
    };

    useEffect(() => {
        if (id) {
            const getCoin = async () => {
                const res = await fetch(
                    `https://api.coingecko.com/api/v3/coins/markets/?vs_currency=usd&ids=${id}`
                );
                const data = await res.json();

                setCoin(data[0]);
            };

            const getPrices = async () => {
                const res = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${id}/market_chart/?vs_currency=usd&days=30`
                );
                const data = await res.json();

                const dataSlice = data.prices.reverse().slice(0, 29);

                dataSlice.map(function (price) {
                    var d = new Date(price[0]);
                    var hour = d.getHours();
                    var mins = d.getMinutes();
                    const ampm = hour >= 12 ? "pm" : "am";

                    keys.push(Number(price[1].toFixed(2)));
                    labels.push(hour + ":" + mins + " " + ampm);
                });

                setPrices(keys);
                setHours(labels);
            };
            getCoin();
            getPrices();
        }
    }, [id]);

    const getLastUpdate = (lastUpdate) => {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        var d = new Date(lastUpdate);
        const year = d.getFullYear();
        const day = d.getDate();
        const monthIndex = d.getMonth();
        const monthName = months[monthIndex];

        const hr = d.getHours();
        const mn = d.getMinutes();
        const sg = d.getSeconds();

        setLastUpdate(monthName + " " + day + ", " + year);
    };

    if (Object.keys(coin).length === 0) return "Cargando...";

    return (
        <>
            <Head>
                <title>{coin.name} Stats - Cryptocurrency Stats</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <meta name="description" content="Cryptocurrency Stats and Prices"></meta>
                <link rel="icon" type="image/png" href={coin.image}></link>
            </Head>
            <Flex p="6">
                <Breadcrumb fontWeight="medium" fontSize="sm">
                    <BreadcrumbItem color="blue.500">
                        <Link href="/">Home</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <p>{coin.name}</p>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Flex>

            <Divider />

            <Flex p="6" align="center">
                <Avatar
                    name={coin.name}
                    src={coin.image}
                    mr={4}
                    background="none"
                />
                <Heading as="h1">{coin.name}</Heading>

                <Badge ml="4" fontSize="1.2em">
                    {coin.symbol.toUpperCase()}
                </Badge>
            </Flex>

            <Divider />

            <StatGroup p="6">
                <Stat>
                    <StatLabel>Current Price</StatLabel>
                    <StatNumber>
                        {coin.current_price.toLocaleString()} <small>USD</small>
                    </StatNumber>
                    <StatHelpText
                        color={
                            Math.sign(coin.price_change_percentage_24h) === 1
                                ? "green.500"
                                : "red.500"
                        }
                    >
                        <StatArrow
                            type={
                                Math.sign(coin.price_change_percentage_24h) ===
                                1
                                    ? "increase"
                                    : "decrease"
                            }
                        />
                        {coin.price_change_percentage_24h.toFixed(2)}%
                    </StatHelpText>
                    <StatHelpText color="gray.500" fontSize="xs">
                        % in the last 24hs
                    </StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>High Price</StatLabel>
                    <StatNumber>
                        {coin.high_24h.toLocaleString()} <small>USD</small>
                    </StatNumber>
                    <StatHelpText color="gray.500" fontSize="xs">
                        in the last 24hs
                    </StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>Low Price</StatLabel>
                    <StatNumber>
                        {coin.low_24h.toLocaleString()} <small>USD</small>
                    </StatNumber>
                    <StatHelpText color="gray.500" fontSize="xs">
                        in the last 24hs
                    </StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>Market Cap (USD)</StatLabel>
                    <StatNumber>
                        {coin.market_cap.toLocaleString()} <small>USD</small>
                    </StatNumber>
                    <StatHelpText
                        color={
                            Math.sign(coin.market_cap_change_percentage_24h) ===
                            1
                                ? "green.500"
                                : "red.500"
                        }
                    >
                        <StatArrow
                            type={
                                Math.sign(
                                    coin.market_cap_change_percentage_24h
                                ) === 1
                                    ? "increase"
                                    : "decrease"
                            }
                        />
                        {coin.market_cap_change_percentage_24h.toFixed(2)}%
                    </StatHelpText>
                    <StatHelpText color="gray.500" fontSize="xs">
                        % in the last 24hs
                    </StatHelpText>
                </Stat>
            </StatGroup>

            <Divider />

            <Box py="6" mb="10">
                <Line data={data} />
            </Box>

            {/* <Flex
				p="4"
			>
				<Text color="gray.500" fontSize="sm">
                    Last update: {lastUpdate}
                </Text>
			</Flex> */}
        </>
    );
};

export default Coin;
