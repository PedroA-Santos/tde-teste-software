import { useState, useEffect } from "react";

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [config, setConfig] = useState(null);
    const [method, setMethod] = useState(null);
    const [callFetch, setCallFetch] = useState(false);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [itemId, setItemId] = useState(null);

    const httpConfig = (data, method) => {
        if (method === "POST" || method === "PUT") {
            setConfig({
                method,
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            });
            setMethod(method);
            if (method === "PUT") {
                setItemId(data.id);
            }
        } else if (method === 'DELETE') {
            setConfig({
                method,
                headers: {
                    "Content-type": "application/json"
                }
            });
            setMethod(method);
            setItemId(data);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error("Houve algum erro na requisição");
                const data = await res.json();
                setData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, callFetch]);

    useEffect(() => {
        const httpRequest = async () => {
            if (method === "POST" || method === "DELETE" || method === "PUT") {
                let fetchOptions = method === "DELETE" ? [`${url}/${itemId}`, config] : [url, config];
                if (method === "PUT") fetchOptions = [`${url}/${itemId}`, config];

                try {
                    const res = await fetch(...fetchOptions);
                    if (!res.ok) throw new Error("Erro ao executar a requisição");
                    const json = await res.json();
                    setCallFetch(json);
                } catch (err) {
                    setError(err.message);
                }
            }
        };

        httpRequest();
    }, [config, method, url, itemId]);

    return { data, httpConfig, loading, error };
};
