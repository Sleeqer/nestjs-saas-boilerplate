import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { url } from 'gravatar';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { Profile, ProfileDocument } from './profile.entity';
import { AppRoles } from '../app/app.roles';
import { RegisterPayload } from '../auth/payload/register.payload';
import { PatchProfilePayload } from './payload/patch.profile.payload';

/**
 * Models a typical response for a crud operation
 */
export interface IGenericMessageBody {
  /**
   * Status message to return
   */
  message: string;
}

/**
 * Profile Service
 */
@Injectable()
export class ProfileService {
  /**
   * Constructor
   * @param {Model<Profile>} repository
   */
  constructor(
    @InjectModel(Profile.name)
    private readonly repository: Model<ProfileDocument>,
  ) {}

  /**
   * Fetches profile from database by UUID
   * @param {string} id
   * @returns {Promise<Profile>} data from queried profile
   */
  get(id: string): Promise<Profile> {
    return this.repository.findById(id).exec();
  }

  /**
   * Fetches profile from database by username
   * @param {string} username
   * @returns {Promise<Profile>} data from queried profile
   */
  getByUsername(username: string): Promise<Profile> {
    return this.repository.findOne({ username }).exec();
  }

  /**
   * Fetches profile by username and hashed password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Profile>} data from queried profile
   */
  getByUsernameAndPass(username: string, password: string): Promise<Profile> {
    return this.repository
      .findOne({
        username,
        password: crypto.createHmac('sha256', password).digest('hex'),
      })
      .exec();
  }

  /**
   * Create a profile with RegisterPayload fields
   * @param {RegisterPayload} payload profile payload
   * @returns {Promise<Profile>} data from the created profile
   */
  async create(payload: RegisterPayload): Promise<Profile> {
    const current = await this.getByUsername(payload.username);

    if (current) {
      throw new NotAcceptableException(
        'The account with the provided username currently exists. Please choose another one.',
      );
    }

    // keep making default roles for every created profile, these roles are defined from AppRoles enum.
    const profile = new this.repository({
      ...payload,
      password: crypto.createHmac("sha256", payload.password).digest("hex"),
      roles: AppRoles.DEFAULT,
      avatar: url(payload.email, {
        protocol: 'http',
        s: '200',
        r: 'pg',
        d: '404',
      }),
    });

    return profile.save();
  }

  /**
   * Edit profile data
   * @param {PatchProfilePayload} payload
   * @returns {Promise<Profile>} mutated profile data
   */
  async edit(payload: PatchProfilePayload): Promise<Profile> {
    const { username } = payload;
    const updatedProfile = await this.repository.updateOne(
      { username },
      payload,
    );
    if (updatedProfile.nModified !== 1) {
      throw new BadRequestException(
        'The profile with that username does not exist in the system. Please try another username.',
      );
    }
    return this.getByUsername(username);
  }

  /**
   * Delete profile given a username
   * @param {string} username
   * @returns {Promise<IGenericMessageBody>} whether or not the delete operation was completed
   */
  async delete(username: string): Promise<IGenericMessageBody> {
    return this.repository.deleteOne({ username }).then((profile) => {
      if (profile.deletedCount === 1) {
        return { message: `Deleted ${username} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a profile by the name of ${username}.`,
        );
      }
    });
  }
}
