import { useContext, useEffect, useState } from "react";
import { DataContext } from "src/app/pages/context/DataContext";
import moment from "moment";

const MonitoringMediaSection = ({ data: dataSaved, isReadOnly }) => {
    const {
        createOrderDetails, setCreateOrderDetails,
        checkedValues, setCheckedValues,
        values, setValues,
        totalFee, setTotalFee,
        startDate, setStartDate,
        endDate, setEndDate,
        days, setDays,
        totalContractedValue, setTotalContractedValue
    } = useContext(DataContext);

    const [error, setError] = useState("");

    const data = isReadOnly ? (dataSaved === undefined ? {} : dataSaved) : {};

    const fechaDesde = moment(data['VIGENCIA DESDE'], 'YYYY-MM-DD');
    const fechaHasta = moment(data['VIGENCIA HASTA'], 'YYYY-MM-DD');

    useEffect(() => {
        if (days < 0) {
            setError("La fecha Hasta no puede ser menor que la fecha Desde.");
        }
    }, [days]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;

        if (name === "Vigencia_Desde") {
            setStartDate(value);
        } else if (name === "Vigencia_Hasta") {
            setEndDate(value);
        }

        // Validación para evitar que la fecha "Hasta" sea menor que "Desde"
        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            setError("La fecha Hasta no puede ser menor que la fecha Desde.");
            setDays(0);
        } else {
            setError("");
        }

        if (!isReadOnly) {
            setCreateOrderDetails(prevDetails => ({
                ...prevDetails,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        const calculateDaysAndValues = () => {
            let calculatedDays = 0;
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);

                const diffTime = end - start;
                calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDays(calculatedDays);

                if (!isReadOnly) {
                    setCreateOrderDetails(prevDetails => ({
                        ...prevDetails,
                        Total_Dias: calculatedDays
                    }));
                }
            }

            // Ahora calculamos los valores totales
            let totalValues = 0;
            for (const key in checkedValues) {
                if (checkedValues[key]) {
                    const rawValue = values[key] || "0"; 
                    const cleanValue = rawValue.replace(/\./g, '');
                    const numericValue = Number(cleanValue);
                    totalValues += numericValue;
                }
            }

            // Valor total mensual
            const totalFeeMonthly = totalValues;
            const totalContracted = totalValues;

            setTotalFee(totalFeeMonthly);
            setTotalContractedValue(totalContracted);

            if (!isReadOnly) {
                setCreateOrderDetails(prevDetails => ({
                    ...prevDetails,
                    Total_Valor: totalFeeMonthly,
                    Total_Valor_Dias: totalContracted
                }));
            }
        };

        calculateDaysAndValues();
    }, [startDate, endDate, checkedValues, values, days, isReadOnly, setCreateOrderDetails]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('createOrderDetails', JSON.stringify(createOrderDetails));
        }
    }, [createOrderDetails]);

    const formatCurrency = (value) => {
        const valueString = value ? String(value) : "0"; 
        const numberValue = parseFloat(valueString.replace(/\./g, '').replace(',', '.'));
        return isNaN(numberValue) ? '0' : numberValue.toLocaleString('es-CO');
    };

    const handleValueChange = (e) => {
        const { name, value } = e.target;

        let cleanValue = value.replace(/\./g, '');

        cleanValue = cleanValue === "0" ? "" : cleanValue;

        const formattedValue = cleanValue !== "" ? Number(cleanValue).toLocaleString('es-CO') : "0";

        setValues((prevValues) => ({
            ...prevValues,
            [name]: formattedValue,
        }));

        // También actualizar createOrderDetails si es necesario
        setCreateOrderDetails((prevDetails) => ({
            ...prevDetails,
            [`VALOR ${name.charAt(0).toUpperCase() + name.slice(1)}`]: formattedValue,
        }));
    };

    const handleCheckChange = (e) => {
        const { name, checked } = e.target;

        setCheckedValues((prev) => ({
            ...prev,
            [name]: checked,
        }));

        if (!checked) {
            setValues((prevValues) => ({
                ...prevValues,
                [name]: "0",
            }));

            setCreateOrderDetails((prevDetails) => ({
                ...prevDetails,
                [`VALOR ${name.charAt(0).toUpperCase() + name.slice(1)}`]: "0",
            }));
        }
    };

    return (
        <div className="border p-4 rounded-lg">
            <h5 className="text-md font-semibold mb-2">MEDIOS A MONITOREAR (Valor fee mensual)</h5>
            {["IMPRESOS", "RADIO", "TELEVISION", "INTERNET", "ANALISIS", "SOCIAL"].map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        className="form-checkbox"
                        name={item}
                        checked={checkedValues[item]}
                        onChange={(e) => handleCheckChange(e)}
                        disabled={isReadOnly}
                    />
                    <span className="ml-2">VALOR {item.charAt(0).toUpperCase() + item.slice(1)}</span>
                    <input
                        type="text"
                        name={item}
                        value={isReadOnly
                            ? formatCurrency(data[`VALOR ${item.charAt(0).toUpperCase() + item.slice(1)}`])
                            : values[item] || "0"}
                        onChange={(e) => handleValueChange(e)}
                        className="ml-auto w-24 px-2 py-1 border border-gray-300 rounded-md"
                        readOnly={isReadOnly}
                    />
                </div>
            ))}

            <div className="flex items-center mb-2">
                <label className="block text-sm font-medium">Vigencia Contrato Desde:</label>
                <input
                    type={isReadOnly ? "text" : "date"}
                    name="Vigencia_Desde"
                    value={isReadOnly ? fechaDesde.format('YYYY-MM-DD') : startDate}
                    onChange={handleDateChange}
                    className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly={isReadOnly}
                />
            </div>
            <div className="flex items-center mb-2">
                <label className="block text-sm font-medium">Hasta:</label>
                <input
                    type={isReadOnly ? "text" : "date"}
                    name="Vigencia_Hasta"
                    value={isReadOnly ? fechaHasta.format('YYYY-MM-DD') : endDate}
                    onChange={handleDateChange}
                    className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly={isReadOnly}
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm mb-2">
                    {error}
                </div>
            )}

            <div className="flex items-center mb-2">
                <label className="block text-sm font-medium">Días</label>
                <input
                    type="number"
                    value={isReadOnly ? fechaHasta.diff(fechaDesde, 'days') : days}
                    readOnly
                    className="ml-2 block w-16 px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="flex items-center mb-2 font-semibold">
                <span>Valor Total Contratado</span>
                <input
                    type="text"
                    value={isReadOnly ? formatCurrency(data['VALOR PACTADO']) : formatCurrency(totalContractedValue)}
                    readOnly
                    className="ml-auto w-24 px-2 py-1 border border-gray-300 rounded-md bg-white text-black"
                />
            </div>
        </div>
    );
};

export default MonitoringMediaSection;
