import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import axios from "axios";
import {useState} from "react";


export default function Advertisements() {


    const [isReady, setIsReady] = useState(false);
    const [advertisements, setAdvertisements] = useState([])
    React.useEffect(() => {
        if(!isReady){
            axios.get(`api/admin/advertisements?latest=1`)
                .then((res) => {
                    if(res.status === 200)
                    {
                        setAdvertisements(res.data.data)
                    }
                })
                .then(() => {
                    setIsReady(true)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [isReady])
    return (
        <React.Fragment>
            <Title>اخر الاعلانات</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>التاريخ</TableCell>
                        <TableCell>الاسم</TableCell>
                        <TableCell>مشحون من</TableCell>
                        <TableCell>مشحون الى</TableCell>
                        <TableCell>الوزن</TableCell>
                        <TableCell align="center">التكلفة لكل كيلوغرام</TableCell>
                        {/* <TableCell align="center">Total Cost</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {advertisements.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.created_at}</TableCell>
                            <TableCell>{row.user.name}</TableCell>
                            <TableCell>{row.from_country_name}<br />{row.from_city_name}</TableCell>
                            <TableCell>{row.to_country_name}<br />{row.to_city_name}</TableCell>
                            <TableCell>{row.weight} Kg</TableCell>
                            <TableCell align="center">{`$${row.cost}`}</TableCell>
                            {/* <TableCell align="center">{`$${Math.round(parseFloat(row.advertisement.cost) * parseFloat(row.weight)).toFixed(2)}`}</TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#/app/advertisements" sx={{ mt: 3 }}>
                عرض المزيد من الاعلانات
            </Link>
        </React.Fragment>
    );
}
