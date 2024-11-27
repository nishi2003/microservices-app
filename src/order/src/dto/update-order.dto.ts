import { IsInt, IsString, Min, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  item?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
