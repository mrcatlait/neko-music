// import { ApiPropertyOptional } from '@nestjs/swagger'
// import { Type } from 'class-transformer'
// import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PageOptionsDto {
  // @ApiPropertyOptional({
  //   minimum: 1,
  //   default: 1,
  // })
  // @Type(() => Number)
  // @IsInt()
  // @Min(0)
  // @IsOptional()
  readonly offset: number = 0

  // @ApiPropertyOptional({
  //   minimum: 1,
  //   maximum: 50,
  //   default: 10,
  // })
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // @Max(50)
  // @IsOptional()
  readonly take: number = 50
}
