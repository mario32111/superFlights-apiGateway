import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { FlightDto } from './dto/flight.dto';
import { FlightMsg, PassengerMsg } from 'src/common/constants';
import { IUser } from 'src/common/interface/user.interface';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('flights')
@Controller('api/v2/flight')
export class FlightController {
    private _clientProxyFlight: ClientProxy;
    private _clientProxyPassenger: ClientProxy;

    constructor(private readonly clientProxy: ClientProxySuperFlights) {
        this._clientProxyFlight = this.clientProxy.clientProxyFlights();
        this._clientProxyPassenger = this.clientProxy.clientProxyPassengers();
    }



    @Post()
    create(@Body() flighDto: FlightDto): Observable<IUser> {
        return this._clientProxyFlight.send(FlightMsg.CREATE, flighDto);
    }

    @Get()
    findAll(): Observable<IUser[]> {
        return this._clientProxyFlight.send(FlightMsg.FIND_ALL, '');
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<IUser> {
        return this._clientProxyFlight.send(FlightMsg.FIND_ONE, id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() flighDto: FlightDto): Observable<IUser> {
        return this._clientProxyFlight.send(FlightMsg.UPDATE, { id, flighDto });
    }

    @Delete(':id')
    delete(@Param('id') id: string): Observable<any> {
        return this._clientProxyFlight.send(FlightMsg.DELETE, id);
    }

    @Post(':flightId/passenger/:passengerId')
    async addPassenger(
        @Param('flightId') flightId: string,
        @Param('passengerId') passengerId: string,
    ){
        const passenger= await this._clientProxyPassenger
        .send(PassengerMsg.FIND_ONE,passengerId)
        .toPromise();

        if(!passenger) throw new HttpException('Passenger Not Found', HttpStatus.NOT_FOUND);

        return this._clientProxyFlight.send(FlightMsg.ADD_PASSENGER, {flightId, passengerId})
    }

}
