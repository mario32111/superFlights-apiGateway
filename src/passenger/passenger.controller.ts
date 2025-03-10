import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IPassenger } from 'src/common/interface/passenger.interface';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { PassengerDto } from './dto/passenger.dto';
import { PassengerMsg } from 'src/common/constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('passengers')
@Controller('api/v2/passenger')
export class PassengerController {
    private _clientProxyPassenger: ClientProxy;

    constructor(private readonly clientProxy: ClientProxySuperFlights) {
        this._clientProxyPassenger = this.clientProxy.clientProxyPassengers();
    }

    @Post()
    create(@Body() passengerDto: PassengerDto): Observable<IPassenger> {
        return this._clientProxyPassenger.send(PassengerMsg.CREATE,passengerDto)
    }

    @Get()
    findAll(): Observable<IPassenger[]> {
        return this._clientProxyPassenger.send(PassengerMsg.FIND_ALL, '');
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<IPassenger> {
        return this._clientProxyPassenger.send(PassengerMsg.FIND_ONE, id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() passengerDto: PassengerDto): Observable<IPassenger> {
        return this._clientProxyPassenger.send(PassengerMsg.UPDATE, { id, passengerDto });
    }

    @Delete(':id')
    delete(@Param('id') id: string): Observable<any> {
        return this._clientProxyPassenger.send(PassengerMsg.DELETE, id);
    }
}
