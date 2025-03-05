import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { UserDto } from './dto/user.dto';
import { Observable } from 'rxjs';
import { IUser } from 'src/common/interface/user.interface';
import { UserMsg } from 'src/common/constants';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/v2/user')
export class UserController {
    private _clientProxyUser: ClientProxy;

    constructor(private readonly clientProxy: ClientProxySuperFlights) {
        this._clientProxyUser = this.clientProxy.clientProxyUsers();
    }

    @Post()
    create(@Body() userDto: UserDto): Observable<IUser> {
        return this._clientProxyUser.send(UserMsg.CREATE, userDto);
    }

    @Get()
    findAll(): Observable<IUser[]> {
        return this._clientProxyUser.send(UserMsg.FIND_ALL, '');
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<IUser> {
        return this._clientProxyUser.send(UserMsg.FIND_ONE, id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() userDto: UserDto): Observable<IUser> {
        return this._clientProxyUser.send(UserMsg.UPDATE, { id, userDto });
    }

    @Delete(':id')
    delete(@Param('id') id: string): Observable<any> {
        return this._clientProxyUser.send(UserMsg.DELETE, id);
    }
}